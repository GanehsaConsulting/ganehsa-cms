"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wrapper } from "@/components/wrapper";
import { SelectComponent } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { getToken } from "@/lib/helpers";
import { Plus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useServices } from "@/hooks/useServices";
import { HeaderActions } from "@/components/header-actions";

interface Feature {
  feature: string;
  status: boolean;
}

interface PackageData {
  id: number;
  serviceId: number;
  type: string;
  price: number;
  discount: number;
  link: string;
  highlight: boolean;
  features: Feature[];
  requirements: string[];
}

export default function EditPackagePage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Form state
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [link, setLink] = useState("");
  const [highlight, setHighlight] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [features, setFeatures] = useState<Feature[]>([
    { feature: "", status: true },
  ]);
  const [requirements, setRequirements] = useState<string[]>([""]);

  // Services hook
  const {
    dataServices,
    isLoading: servicesLoading,
    fetchDataService,
  } = useServices();

  // Fetch package data
  useEffect(() => {
    const fetchPackageData = async () => {
      const token = getToken();
      if (!token) {
        toast.error("Token tidak ditemukan");
        router.push("/business/packages");
        return;
      }

      try {
        const response = await fetch(`/api/packages/${packageId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data package");
        }

        const result = await response.json();

        if (result.success && result.data) {
          const data: PackageData = result.data;
          setType(data.type);
          setPrice(data.price.toString());
          setDiscount(data.discount.toString());
          setLink(data.link);
          setHighlight(data.highlight);
          setServiceId(data.serviceId.toString());
          setFeatures(
            data.features.length > 0
              ? data.features
              : [{ feature: "", status: true }]
          );
          setRequirements(
            data.requirements.length > 0 ? data.requirements : [""]
          );
        } else {
          throw new Error("Data package tidak ditemukan");
        }
      } catch (error) {
        console.error("Error fetching package:", error);
        toast.error(
          error instanceof Error ? error.message : "Gagal memuat data package"
        );
        router.push("/business/packages");
      } finally {
        setIsFetching(false);
      }
    };

    if (packageId) {
      fetchPackageData();
    }
  }, [packageId, router]);

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

  // Fix price validation in validateForm
  const validateForm = () => {
    if (!serviceId) {
      toast.error("Service harus dipilih");
      return false;
    }

    if (!type.trim()) {
      toast.error("Type package harus diisi");
      return false;
    }

    // Fix price validation - allow 0 or empty
    if (price === "" || price === null || price === undefined) {
      toast.error("Price harus diisi");
      return false;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error("Price harus berupa angka yang valid");
      return false;
    }

    // Fix discount validation
    if (discount !== "" && discount !== null && discount !== undefined) {
      const discountNum = parseFloat(discount);
      if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
        toast.error("Discount harus antara 0-100");
        return false;
      }
    }

    if (!link.trim()) {
      toast.error("Link harus diisi");
      return false;
    }

    const validFeatures = features.filter((f) => f.feature.trim() !== "");
    if (validFeatures.length === 0) {
      toast.error("Minimal harus ada 1 feature yang diisi");
      return false;
    }

    return true;
  };

  // Handle submit
  // Enhanced error handling in handleSubmit
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
      const validFeatures = features.filter((f) => f.feature.trim() !== "");
      const validRequirements = requirements.filter((r) => r.trim() !== "");

      const payload = {
        serviceId: parseInt(serviceId),
        type: type.trim(),
        price: price ? parseFloat(price) : 0, // Handle empty price
        discount: discount ? parseFloat(discount) : 0, // Handle empty discount
        link: link.trim(),
        highlight,
        features: validFeatures,
        requirements: validRequirements,
      };

      console.log("📦 Updating package with payload:", payload);

      const response = await fetch(`/api/packages/${packageId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      console.log("📩 API Response:", responseData);

      if (!response.ok) {
        // More detailed error information
        throw new Error(
          responseData.message || `HTTP error! status: ${response.status}`
        );
      }

      if (responseData.success) {
        toast.success("Package berhasil diupdate!");
        router.push("/business/packages");
        router.refresh();
      } else {
        throw new Error(responseData.message || "Gagal mengupdate package");
      }
    } catch (error) {
      console.error("❌ Error updating package:", error);

      // More specific error messages
      let errorMessage = "Terjadi kesalahan";
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage =
            "Koneksi jaringan terganggu. Periksa koneksi internet Anda.";
        } else if (error.message.includes("401")) {
          errorMessage = "Sesi telah berakhir. Silakan login kembali.";
        } else if (error.message.includes("404")) {
          errorMessage = "Package tidak ditemukan.";
        } else if (error.message.includes("500")) {
          errorMessage = "Terjadi kesalahan server. Silakan coba lagi nanti.";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching || servicesLoading) {
    return (
      <Wrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
            <p className="text-white">Memuat data package...</p>
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div>
        {/* Header */}
        <HeaderActions position="left">
          <h1 className="text-xs capitalize px-4 py-2 font-semibold bg-black/50 dark:bg-white/10 rounded-full border border-neutral-300/10 text-white">
            Edit Package
          </h1>
        </HeaderActions>

        <HeaderActions position="right">
          <div className="flex items-center gap-3">
            <Link href="/business/packages">
              <Button type="button" variant="outline" disabled={isLoading}>
                Batal
              </Button>
            </Link>
            <Button
              type="submit"
              form="edit-package-form"
              disabled={isLoading || dataServices.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Menyimpan...
                </>
              ) : (
                "Update Package"
              )}
            </Button>
          </div>
        </HeaderActions>

        {/* No Services Available */}
        {dataServices.length === 0 && !servicesLoading && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-yellow-400">
                  Tidak ada Services Tersedia
                </h3>
                <p className="text-yellow-300/80 mt-1">
                  Anda perlu membuat service terlebih dahulu sebelum mengedit
                  package.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={fetchDataService}
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                >
                  <Loader2 className="w-4 h-4 mr-2" />
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
          <form
            id="edit-package-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
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
                />
                <p className="text-sm text-gray-400">
                  Pilih service yang akan dikaitkan dengan package ini
                </p>
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
                    onChange={(e) => setDiscount(e.target.value)}
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
                  onCheckedChange={(checked) =>
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
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Checkbox
                      id={`feature-status-${index}`}
                      checked={feature.status}
                      onCheckedChange={(checked) =>
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

            {/* pindahin Actions button keatas */}
            {/* <div className="flex items-center justify-end gap-4">
              <Link href="/business/packages">
                <Button type="button" variant="outline" disabled={isLoading}>
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Update Package"}
              </Button>
            </div> */}
          </form>
        )}
      </div>
    </Wrapper>
  );
}
