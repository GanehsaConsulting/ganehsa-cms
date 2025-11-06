"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wrapper } from "@/components/wrapper";
import { Loader2, Upload, X, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { HeaderActions } from "@/components/header-actions";

interface Package {
  id: number;
  type: string;
  serviceId: number;
  service: {
    name: string;
  };
}

interface ProjectFormProps {
  projectId?: string;
}

export function ProjectForm({ projectId }: ProjectFormProps) {
  const router = useRouter();
  const isEdit = !!projectId;

  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<number[]>([]);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    link: "",
  });

  useEffect(() => {
    fetchPackages();
    if (isEdit) fetchProject();
  }, [projectId]);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/packages");
      const data = await res.json();

      if (data.success) {
        const websitePackages = data.data.filter(
          (pkg: any) => pkg.service?.slug === "website-development"
        );
        setPackages(websitePackages);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();
      if (data.success) {
        const project = data.data;
        setFormData({
          name: project.name,
          companyName: project.companyName,
          link: project.link,
        });
        setPreviewUrl(project.preview);
        setSelectedPackages(project.packages.map((p: any) => p.package.id));
      }
    } catch (error) {
      toast.error("Failed to fetch project data");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) return toast.error("Max size 10MB");
      const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowed.includes(file.type))
        return toast.error("Only JPG/PNG/WEBP allowed");
      setPreviewFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemovePreview = () => {
    setPreviewFile(null);
    setPreviewUrl("");
  };

  const togglePackage = (packageId: number) => {
    setSelectedPackages((prev) =>
      prev.includes(packageId)
        ? prev.filter((id) => id !== packageId)
        : [...prev, packageId]
    );
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.companyName || !formData.link)
      return toast.error("Please fill all required fields");

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("companyName", formData.companyName);
      submitData.append("link", formData.link);
      submitData.append("packageIds", JSON.stringify(selectedPackages));
      if (previewFile) submitData.append("preview", previewFile);

      const url = isEdit ? `/api/projects/${projectId}` : "/api/projects";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, { method, body: submitData });
      const data = await res.json();

      if (data.success) {
        toast.success(isEdit ? "Project updated!" : "Project created!");
        router.push("/dashboard/projects");
      } else toast.error(data.message || "Failed to save project");
    } catch (error) {
      toast.error("Error saving project");
    } finally {
      setLoading(false);
    }
  };

  const packagesByService = packages.reduce((acc, pkg) => {
    const name = pkg.service?.name;
    if (!acc[name]) acc[name] = [];
    acc[name].push(pkg);
    return acc;
  }, {} as Record<string, Package[]>);

  const handleCancel = () => router.push("/dashboard/projects");

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
          <div className="p-6 rounded-xl bg-white/10 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Project Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter project name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-white">
                Company Name *
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link" className="text-white">
                Project URL *
              </Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                placeholder="https://example.com"
              />
            </div>
          </div>

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
            <Label className="text-white">Select Packages</Label>
            {Object.keys(packagesByService).length === 0 ? (
              <p className="text-neutral-400 text-sm">No packages available</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(packagesByService).map(
                  ([serviceName, pkgs]) => (
                    <div key={serviceName}>
                      <h3 className="text-sm font-medium text-neutral-300 mb-2">
                        {serviceName}
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {pkgs.map((pkg) => (
                          <button
                            key={pkg.id}
                            type="button"
                            onClick={() => togglePackage(pkg.id)}
                            className={`p-2 text-xs rounded-md border transition-all ${
                              selectedPackages.includes(pkg.id)
                                ? "border-mainColor bg-mainColor/20 text-white"
                                : "border-neutral-700 hover:border-neutral-600 text-neutral-300"
                            }`}
                          >
                            {pkg.type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </Wrapper>
    </>
  );
}
