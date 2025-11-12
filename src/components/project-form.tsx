"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wrapper } from "@/components/wrapper";
import { Upload, X, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { HeaderActions } from "@/components/header-actions";
import { usePackages } from "@/hooks/usePackages";
import { getToken } from "@/lib/helpers";

interface ProjectFormProps {
  projectId?: string;
  serviceId: number;
  basePath: string;
  pageTitle: string;
}

interface FormData {
  name: string;
  companyName: string;
  link: string;
}

interface ProjectPackage {
  package: {
    id: number;
    type: string;
    serviceId: number;
  };
}

interface ProjectResponse {
  success: boolean;
  data: {
    name: string;
    companyName: string;
    link: string;
    preview: string;
    packages: ProjectPackage[];
  };
  message?: string;
}

// FIXED: Define a minimal interface with only the properties we actually use
interface Package {
  id: number;
  type: string;
  serviceId: number;
}

export function ProjectForm({
  projectId,
  serviceId,
  basePath,
  pageTitle,
}: ProjectFormProps) {
  const router = useRouter();
  const isEdit = !!projectId;

  const hasFetched = useRef(false);
  const isFetching = useRef(false);
  const initialPackageSet = useRef(false);

  const [loading, setLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [projectData, setProjectData] = useState<
    ProjectResponse["data"] | null
  >(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    companyName: "",
    link: "",
  });

  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  // FIXED: Use the minimal Package interface and handle type conversion safely
  const { packages, isLoading: packagesLoading, setServiceIdFilter } = usePackages();

  useEffect(() => {
    setServiceIdFilter(serviceId);
  }, [setServiceIdFilter]);

  // FIXED: Safely convert packages to our Package type
  const servicePackages = packages
    .map((pkg) => {
      const p = pkg as unknown as Record<string, unknown>;

      const id =
        typeof p["id"] === "number"
          ? (p["id"] as number)
          : Number(p["id"] as unknown as string);

      const type =
        typeof p["type"] === "string"
          ? (p["type"] as string)
          : String(p["type"] ?? "");

      const serviceIdValue =
        typeof p["serviceId"] === "number"
          ? (p["serviceId"] as number)
          : typeof p["service_id"] === "number"
          ? (p["service_id"] as number)
          : undefined;

      return {
        id,
        type,
        serviceId: serviceIdValue ?? 0,
      } as Package;
    })
    .filter((pkg: Package) => pkg.serviceId === serviceId);

  // ✅ Fetch data project (edit mode)
  const fetchProject = useCallback(async () => {
    if (isFetching.current || hasFetched.current || !projectId) {
      return;
    }

    isFetching.current = true;

    try {
      const token = getToken();

      const res = await fetch(`/api/projects/${projectId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data: ProjectResponse = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Unauthorized. Please login again.");
          router.push("/login");
          return;
        }
        throw new Error(data.message || "Failed to fetch project");
      }

      if (data.success) {
        setProjectData(data.data);
        setFormData({
          name: data.data.name,
          companyName: data.data.companyName,
          link: data.data.link,
        });
        setPreviewUrl(data.data.preview);

        hasFetched.current = true;
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch project data";
      toast.error(errorMessage);
    } finally {
      isFetching.current = false;
    }
  }, [projectId, router]);

  // FIXED: Set selected package hanya sekali saat initial load
  useEffect(() => {
    if (isEdit && projectId && !hasFetched.current) {
      fetchProject();
    }
  }, [isEdit, projectId, fetchProject]);

  // FIXED: Effect untuk set selected package hanya sekali saat initial load
  useEffect(() => {
    // Only set the initial package once when both projectData and servicePackages are available
    // and we haven't set it yet
    if (
      projectData &&
      servicePackages.length > 0 &&
      !initialPackageSet.current
    ) {
      // Cari package dari project yang sesuai dengan serviceId saat ini
      const projectPackagesForService = projectData.packages?.filter(
        (pkg: ProjectPackage) => {
          return servicePackages.some(
            (sp: Package) => sp.id === pkg.package.id
          );
        }
      );

      console.log("Project packages for service:", projectPackagesForService);
      console.log("Available service packages:", servicePackages);

      if (projectPackagesForService && projectPackagesForService.length > 0) {
        // Ambil package pertama yang sesuai
        const firstMatchingPackage = projectPackagesForService[0];
        setSelectedPackage(firstMatchingPackage.package.id);
        console.log(
          "Setting initial package to:",
          firstMatchingPackage.package.id
        );
      } else if (servicePackages.length > 0) {
        // Jika tidak ada package yang cocok, set ke package pertama dari service
        setSelectedPackage(servicePackages[0].id);
        console.log(
          "Setting initial package to first available:",
          servicePackages[0].id
        );
      }

      // Mark that we've set the initial package
      initialPackageSet.current = true;
    }
  }, [projectData, servicePackages]);

  // ✅ Upload preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return toast.error("Max size 10MB");

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type))
      return toast.error("Only JPG/PNG/WEBP allowed");

    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemovePreview = () => {
    setPreviewFile(null);
    setPreviewUrl("");
  };

  // FIXED: Handler untuk select package yang lebih sederhana
  const handleSelect = (id: number) => {
    console.log("User selected package:", id);
    setSelectedPackage(id);
  };

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleSubmit = async () => {
    if (!formData.name || !formData.companyName || !formData.link)
      return toast.error("Please fill all required fields");
    if (!selectedPackage)
      return toast.error(
        `Please select one ${pageTitle.toLowerCase()} package`
      );

    setLoading(true);
    try {
      const token = getToken();

      if (!token) {
        toast.error("Authentication required. Please login.");
        router.push("/login");
        return;
      }

      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("companyName", formData.companyName);
      submitData.append("link", formData.link);
      submitData.append("packageIds", JSON.stringify([selectedPackage]));
      if (previewFile) submitData.append("preview", previewFile);

      const url = isEdit ? `/api/projects/${projectId}` : "/api/projects";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        body: submitData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Session expired. Please login again.");
          router.push("/login");
          return;
        }
        throw new Error(data.message || "Failed to save project");
      }

      if (data.success) {
        toast.success(isEdit ? "Project updated!" : "Project created!");
        router.push(basePath);
      } else {
        toast.error(data.message || "Failed to save project");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error saving project";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => router.push(basePath);

  const formFields: (keyof FormData)[] = ["name", "companyName", "link"];

  const getPlaceholderText = (field: string) => {
    if (field === "link") {
      return "https://www.ini-url.com";
    }
    return `Enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`;
  };

  return (
    <>
      {/* Header */}
      <HeaderActions position="left">
        <h1 className="text-xs capitalize px-4 py-2 font-semibold bg-black/50 dark:bg-white/10 rounded-full border border-neutral-300/10 text-white">
          {isEdit
            ? `Edit ${pageTitle} Project`
            : `Create New ${pageTitle} Project`}
        </h1>
      </HeaderActions>

      <HeaderActions position="right">
        <div className="flex items-center gap-2">
          <AlertDialogComponent
            header="Batalkan perubahan?"
            desc="Semua data yang belum disimpan akan hilang."
            continueAction={handleCancel}
          >
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={loading}>
                Batal
              </Button>
            </AlertDialogTrigger>
          </AlertDialogComponent>

          <AlertDialogComponent
            header="Simpan project?"
            desc="Project akan disimpan."
            continueAction={handleSubmit}
          >
            <AlertDialogTrigger asChild>
              <Button size="sm" disabled={loading || packagesLoading}>
                <Plus className="w-4 h-4 mr-1" />
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </AlertDialogTrigger>
          </AlertDialogComponent>
        </div>
      </HeaderActions>

      <Wrapper className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Form input */}
          <div className="p-6 rounded-xl bg-white/10 space-y-5">
            {formFields.map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field} className="text-white capitalize">
                  {field === "link"
                    ? "Project URL *"
                    : `${field.replace(/([A-Z])/g, " $1").toLowerCase()} *`}
                </Label>
                <Input
                  id={field}
                  type={field === "link" ? "url" : "text"}
                  value={formData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  placeholder={getPlaceholderText(field)}
                />
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="p-6 rounded-xl bg-white/10 space-y-5">
            <Label className="text-white">Preview Image</Label>
            {previewUrl ? (
              <div className="relative rounded-lg overflow-hidden bg-neutral-800">
                <div
                  className={`relative ${
                    serviceId === 7
                      ? "aspect-[4/5] max-w-md mx-auto"
                      : "aspect-[16/8.5] "
                  }`}
                >
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {serviceId === 7 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-xs">📱</span>
                          </div>
                          <span className="text-white text-sm font-medium">
                            Social Media
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-neutral-300">
                          <span className="text-xs">❤️ 1.2K</span>
                          <span className="text-xs">💬 45</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-700"
                    onClick={handleRemovePreview}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {serviceId === 7 && (
                  <div className="p-3 bg-neutral-900/50 border-t border-neutral-700">
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span>Instagram Post Preview</span>
                      <span>1080×1350 px</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-neutral-600 rounded-lg p-8 text-center hover:border-neutral-500 transition-colors">
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-neutral-500" />
                  <p className="text-neutral-300 mb-2 text-sm font-medium">
                    Upload {pageTitle.toLowerCase()} preview
                  </p>
                  <p className="text-neutral-400 mb-4 text-xs">
                    {serviceId === 7
                      ? "Recommended: Square or portrait (1:1 or 4:5 ratio)"
                      : "Recommended: Landscape (16:9 ratio)"}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("preview-upload")?.click()
                      }
                      className="text-xs"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                    <Input
                      id="preview-upload"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  {serviceId === 7 && (
                    <div className="text-xs text-neutral-500 mt-2">
                      Max 10MB • JPG, PNG, WEBP
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 rounded-xl bg-white/10 space-y-5">
            <Label className="text-white">Select {pageTitle} Package</Label>

            {packagesLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-4 h-4 animate-spin text-mainColor mr-2" />
                <span className="text-neutral-400 text-sm">
                  Loading packages...
                </span>
              </div>
            ) : servicePackages.length === 0 ? (
              <p className="text-neutral-400 text-sm">No packages available</p>
            ) : (
              <div className="flex flex-col gap-2">
                {servicePackages.map((pkg: Package) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => handleSelect(pkg.id)}
                    className={`p-3 text-sm rounded-md transition-all cursor-pointer text-left ${
                      selectedPackage === pkg.id
                        ? "border-2 border-mainColor bg-mainColor/20 text-white"
                        : "border border-neutral-600 bg-neutral-800/50 text-white hover:bg-neutral-700/50"
                    }`}
                  >
                    <div className="font-medium">{pkg.type}</div>
                    {selectedPackage === pkg.id && (
                      <div className="text-xs text-mainColor mt-1">
                        ✓ Selected
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Wrapper>
    </>
  );
}
