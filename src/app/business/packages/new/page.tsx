"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wrapper } from "@/components/wrapper";
import { SelectComponent } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getToken } from "@/lib/helpers";
import { ArrowLeft, Plus, Trash2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useServices } from "@/hooks/useServices";

interface Feature {
  feature: string;
  status: boolean;
}

export default function NewPackagePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { dataServices, isLoading: servicesLoading, fetchDataService } = useServices();

  // Form state
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("")
  const [link, setLink] = useState("");
  const [highlight, setHighlight] = useState(false);
  const [features, setFeatures] = useState<Feature[]>([
    { feature: "", status: true },
  ]);
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [serviceId, setServiceId] = useState("");

  // Add new feature
  const handleAddFeature = () => {
    setFeatures([...features, { feature: "", status: true }]);
  };

  // Remove feature
  const handleRemoveFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };

  // Update feature text
  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index].feature = value;
    setFeatures(updatedFeatures);
  };

  // Toggle feature status
  const handleFeatureStatusChange = (index: number, checked: boolean) => {
    const updatedFeatures = [...features];
    updatedFeatures[index].status = checked;
    setFeatures(updatedFeatures);
  };

  // Add new requirement
  const handleAddRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  // Remove requirement
  const handleRemoveRequirement = (index: number) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
    }
  };

  // Update requirement text
  const handleRequirementChange = (index: number, value: string) => {
    const updatedRequirements = [...requirements];
    updatedRequirements[index] = value;
    setRequirements(updatedRequirements);
  };

  // Refresh services
  const handleRefreshServices = () => {
    fetchDataService();
  };

  // Validate form
  const validateForm = () => {
    if (!serviceId) {
      toast.error("Service harus dipilih");
      return false;
    }

    if (!type.trim()) {
      toast.error("Type package harus diisi");
      return false;
    }

    if (!price || parseFloat(price) <= 0) {
      toast.error("Price harus diisi dengan nilai yang valid");
      return false;
    }


    if (!link.trim()) {
      toast.error("Link harus diisi");
      return false;
    }

    // Validate features
    const validFeatures = features.filter((f) => f.feature.trim() !== "");
    if (validFeatures.length === 0) {
      toast.error("Minimal harus ada 1 feature yang diisi");
      return false;
    }

    return true;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const token = getToken();
    if (!token) {
      toast.error("Token tidak ditemukan. Silakan login kembali.");
      return;
    }

    setIsLoading(true);

    try {
      // Filter out empty features and requirements
      const validFeatures = features.filter((f) => f.feature.trim() !== "");
      const validRequirements = requirements.filter((r) => r.trim() !== "");

      const payload = {
        serviceId: parseInt(serviceId),
        type: type.trim(),
        price: parseFloat(price),
        discount: parseFloat(discount),
        link: link.trim(),
        highlight,
        features: validFeatures,
        requirements: validRequirements,
      };

      console.log("📦 Creating package with payload:", payload);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/packages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal membuat package");
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Package berhasil dibuat!");
        router.push("/business/packages");
        router.refresh();
      } else {
        throw new Error(data.message || "Gagal membuat package");
      }
    } catch (error) {
      console.error("Error creating package:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // If services are loading
  if (servicesLoading) {
    return (
      <Wrapper>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Memuat services...</p>
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/business/packages">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Package Baru</h1>
              <p className="text-sm text-gray-400">Buat package pricing baru</p>
            </div>
          </div>
        </div>

        {/* No Services Available */}
        {dataServices.length === 0 && !servicesLoading && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-yellow-400">
                  Tidak ada Services Tersedia
                </h3>
                <p className="text-yellow-300/80 mt-1">
                  Anda perlu membuat service terlebih dahulu sebelum membuat package.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRefreshServices}
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Link href="/business/services/new">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    Buat Service Baru
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Form - Only show if services are available */}
        {dataServices.length > 0 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white/5 rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white mb-4">
                Informasi Dasar
              </h2>

              {/* Service Selection */}
              <div className="space-y-2">
                <Label className="text-white">
                  Service <span className="text-red-500">*</span>
                </Label>
                <SelectComponent
                  placeholder="Pilih Service"
                  options={dataServices.map((service) => ({
                    label: service.name,
                    value: String(service.id),
                  }))}
                  value={serviceId}
                  onChange={setServiceId}
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type" className="text-white">
                  Type Package <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="type"
                  placeholder="e.g., Basic, Premium, Pro"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                />
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-white">
                    Price (Rp) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="150000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="0"
                    step="1000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount" className="text-white">
                    Discount (%) 
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    placeholder="50"
                    value={discount}
                    onChange={(e) =>setDiscount(e.target.value)}
                    required
                    min="0"
                  />
                </div>
              </div>

              {/* Link */}
              <div className="space-y-2">
                <Label htmlFor="link" className="text-white">
                  Link <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="link"
                  type="url"
                  placeholder="https://example.com/order"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  required
                />
              </div>

              {/* Highlight */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="highlight"
                  checked={highlight}
                  onCheckedChange={(checked: boolean) =>
                    setHighlight(checked as boolean)
                  }
                />
                <Label
                  htmlFor="highlight"
                  className="text-white cursor-pointer text-sm font-normal"
                >
                  Highlight package (tampilkan sebagai rekomendasi)
                </Label>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white/5 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Features <span className="text-red-500">*</span>
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddFeature}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </div>

              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder={`Feature ${index + 1}`}
                      value={feature.feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Checkbox
                      id={`feature-status-${index}`}
                      checked={feature.status}
                      onCheckedChange={(checked: boolean) =>
                        handleFeatureStatusChange(index, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`feature-status-${index}`}
                      className="text-white text-sm cursor-pointer"
                    >
                      Active
                    </Label>
                  </div>
                  {features.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveFeature(index)}
                      className="mt-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Requirements */}
            <div className="bg-white/5 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Requirements
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddRequirement}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Requirement
                </Button>
              </div>

              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder={`Requirement ${index + 1}`}
                      value={requirement}
                      onChange={(e) =>
                        handleRequirementChange(index, e.target.value)
                      }
                    />
                  </div>
                  {requirements.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveRequirement(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Link href="/business/packages">
                <Button type="button" variant="outline" disabled={isLoading}>
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan Package"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Wrapper>
  );
}