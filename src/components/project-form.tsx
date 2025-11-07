"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wrapper } from "@/components/wrapper";
import { Upload, X, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { HeaderActions } from "@/components/header-actions";
import { usePackages } from "@/hooks/usePackages";

interface ProjectFormProps {
  projectId?: string;
}

export function ProjectForm({ projectId }: ProjectFormProps) {
  const router = useRouter();
  const isEdit = !!projectId;

  const [loading, setLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    link: "",
  });

  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  // ✅ Ambil data packages
  const { packages } = usePackages();
  const websitePackages = packages.filter((pkg: any) => pkg.serviceId === 3);

  // ✅ Fungsi untuk mendapatkan token
  const getToken = (): string | null => {
    // Opsi 1: Dari localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }

    // Opsi 2: Dari cookie (jika menggunakan cookie-based auth)
    // return document.cookie
    //   .split("; ")
    //   .find((row) => row.startsWith("token="))
    //   ?.split("=")[1] || null;

    return null;
  };

  // ✅ Fetch data project (edit mode)
  useEffect(() => {
    if (isEdit) fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const token = getToken();

      const res = await fetch(`/api/projects/${projectId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Unauthorized. Please login again.");
          router.push("/login");
          return;
        }
        throw new Error(data.message || "Failed to fetch project");
      }

      if (data.success) {
        const project = data.data;
        setFormData({
          name: project.name,
          companyName: project.companyName,
          link: project.link,
        });
        setPreviewUrl(project.preview);
        // Ambil hanya 1 package id
        if (project.packages?.length > 0) {
          setSelectedPackage(project.packages[0].package.id);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch project data");
    }
  };

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

  const handleSelect = (id: number) => {
    setSelectedPackage((prev) => (prev === id ? null : id)); // toggle select
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.companyName || !formData.link)
      return toast.error("Please fill all required fields");
    if (!selectedPackage)
      return toast.error("Please select one website package");

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
      // ✅ PERBAIKAN: Kirim sebagai array JSON
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
        router.push("/projects/website-development");
      } else {
        toast.error(data.message || "Failed to save project");
      }
    } catch (error: any) {
      toast.error(error.message || "Error saving project");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => router.push("/projects/website-development");

  return (
    <>
      {/* Header */}
      <HeaderActions position="left">
        <h1 className="text-xs capitalize px-4 py-2 font-semibold bg-black/50 dark:bg-white/10 rounded-full border border-neutral-300/10 text-white">
          {isEdit ? "Edit Project" : "Create New Project"}
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
              <Button size="sm" disabled={loading}>
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
            {["name", "companyName", "link"].map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field} className="text-white capitalize">
                  {field === "link" ? "Project URL *" : `${field} *`}
                </Label>
                <Input
                  id={field}
                  type={field === "link" ? "url" : "text"}
                  value={(formData as any)[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  placeholder={
                    field === "link"
                      ? "https://example.com"
                      : `Enter ${field
                          .replace(/([A-Z])/g, " $1")
                          .toLowerCase()}`
                  }
                />
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="p-6 rounded-xl bg-white/10 space-y-5">
            <Label className="text-white">Preview Image</Label>
            {previewUrl ? (
              <div className="relative w-full h-64 rounded-lg overflow-hidden bg-neutral-800">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemovePreview}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg p-8 text-center">
                <Upload className="w-10 h-10 mx-auto mb-3 text-neutral-500" />
                <p className="text-neutral-400 mb-3 text-sm">
                  Upload a preview image (max 10MB)
                </p>
                <Input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="max-w-xs mx-auto"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 rounded-xl bg-white/10 space-y-5">
            <Label className="text-white">Select Website Package</Label>
            {websitePackages.length === 0 ? (
              <p className="text-neutral-400 text-sm">No packages available</p>
            ) : (
              <div className="flex flex-col gap-2">
                {websitePackages.map((pkg: any) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => handleSelect(pkg.id)}
                    className={`p-2 text-xs rounded-md transition-all cursor-pointer ${
                      selectedPackage === pkg.id
                        ? "border border-mainColor bg-mainColor/60 text-white"
                        : "bg-mainColor/20 text-white"
                    }`}
                  >
                    {pkg.type}
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
