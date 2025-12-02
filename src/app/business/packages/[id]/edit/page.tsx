"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wrapper } from "@/components/wrapper";
import { SelectComponent } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { getToken } from "@/lib/helpers";
import { Plus, Trash2, Loader2, AlertCircle, Check, X } from "lucide-react";
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

interface OriginalData {
  type: string;
  price: string;
  discount: string;
  link: string;
  highlight: boolean;
  serviceId: string;
  features: Feature[];
  requirements: string[];
}

interface OptimizedPayload {
  serviceId: number;
  type: string;
  price: number;
  discount: number;
  link: string;
  highlight: boolean;
  features: Feature[];
  requirements: string[];
}

// Constants untuk optimasi
const MAX_FEATURES = 50;
const MAX_REQUIREMENTS = 30;
const BATCH_SIZE = 20;

export default function EditPackagePage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
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

  // Refs untuk tracking
  const originalDataRef = useRef<OriginalData | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Services hook
  const {
    dataServices,
    isLoading: servicesLoading,
    fetchDataService,
  } = useServices();

  // Fungsi untuk mengoptimalkan data sebelum dikirim
  const optimizePayload = (payload: {
    serviceId: string;
    type: string;
    price: string;
    discount: string;
    link: string;
    highlight: boolean;
    features: Feature[];
    requirements: string[];
  }): OptimizedPayload => {
    // Remove empty features dan requirements
    const filteredFeatures = payload.features.filter(f => f.feature.trim() !== "");
    const filteredRequirements = payload.requirements.filter(r => r.trim() !== "");
    
    // Trim semua string
    const trimmedFeatures = filteredFeatures.map((f: Feature) => ({
      feature: f.feature.trim(),
      status: f.status
    }));
    
    const trimmedRequirements = filteredRequirements.map((r: string) => r.trim());
    
    // Konversi tipe data
    const serviceIdNum = parseInt(payload.serviceId);
    const priceNum = parseFloat(payload.price) || 0;
    const discountNum = parseFloat(payload.discount) || 0;
    
    return {
      serviceId: isNaN(serviceIdNum) ? 0 : serviceIdNum,
      type: payload.type.trim(),
      price: isNaN(priceNum) ? 0 : priceNum,
      discount: isNaN(discountNum) ? 0 : discountNum,
      link: payload.link.trim(),
      highlight: payload.highlight,
      features: trimmedFeatures,
      requirements: trimmedRequirements,
    };
  };

  // Fetch package data dengan retry
  const fetchPackageData = async (retryCount = 0): Promise<void> => {
    const token = getToken();
    if (!token) {
      toast.error("Token tidak ditemukan");
      router.push("/business/packages");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/business/packages/${packageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: AbortSignal.timeout(10000), // 10 second timeout
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Package tidak ditemukan");
        }
        if (response.status === 401) {
          throw new Error("Sesi telah berakhir, silakan login kembali");
        }
        throw new Error(`Gagal mengambil data (${response.status})`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        const data: PackageData = result.data;
        
        // Log untuk debugging
        console.log("📦 Data package dari API:", {
          type: data.type,
          price: data.price,
          features: data.features,
          requirements: data.requirements,
        });

        setType(data.type || "");
        setPrice(data.price?.toString() || "0");
        setDiscount(data.discount?.toString() || "0");
        setLink(data.link || "");
        setHighlight(data.highlight || false);
        setServiceId(data.serviceId?.toString() || "");
        
        // Handle features - pastikan array tidak kosong
        const initialFeatures = Array.isArray(data.features) && data.features.length > 0
          ? data.features.map(f => ({
              feature: f.feature || "",
              status: f.status !== undefined ? f.status : true
            }))
          : [{ feature: "", status: true }];
        
        setFeatures(initialFeatures);
        
        // Handle requirements - pastikan array tidak kosong
        const initialRequirements = Array.isArray(data.requirements) && data.requirements.length > 0
          ? data.requirements.map(r => r || "")
          : [""];
        
        setRequirements(initialRequirements);
        
        // Simpan original data untuk comparison
        originalDataRef.current = {
          type: data.type || "",
          price: data.price?.toString() || "0",
          discount: data.discount?.toString() || "0",
          link: data.link || "",
          highlight: data.highlight || false,
          serviceId: data.serviceId?.toString() || "",
          features: initialFeatures,
          requirements: initialRequirements,
        };
        
        setErrorDetails(null);
      } else {
        throw new Error(result.message || "Data package tidak valid");
      }
    } catch (error: unknown) {
      console.error("❌ Error fetching package:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Gagal memuat data package";
      
      // Retry logic
      if (retryCount < 3 && !errorMessage.includes("404")) {
        console.log(`🔄 Retrying fetch (${retryCount + 1}/3)...`);
        setTimeout(() => fetchPackageData(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }
      
      const finalErrorMessage = errorMessage.includes("Timeout") 
        ? "Timeout: Server terlalu lama merespon"
        : errorMessage;
      
      toast.error(finalErrorMessage);
      setErrorDetails(finalErrorMessage);
      
      // Don't redirect immediately, show error with retry option
      if (errorMessage.includes("404") || errorMessage.includes("401")) {
        setTimeout(() => router.push("/business/packages"), 3000);
      }
    } finally {
      setIsFetching(false);
    }
  };

  // Load data saat component mount
  useEffect(() => {
    if (packageId) {
      fetchPackageData();
    }
    
    return () => {
      // Cleanup abort controller
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [packageId, router]);

  // Feature handlers
  const handleAddFeature = () => {
    if (features.length >= MAX_FEATURES) {
      toast.error(`Maksimal ${MAX_FEATURES} features diperbolehkan`);
      return;
    }
    setFeatures([...features, { feature: "", status: true }]);
  };

  const handleRemoveFeature = (index: number) => {
    if (features.length > 1) {
      const newFeatures = [...features];
      newFeatures.splice(index, 1);
      setFeatures(newFeatures);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index].feature = value;
    setFeatures(updatedFeatures);
  };

  const handleFeatureStatusChange = (index: number, checked: boolean) => {
    const updatedFeatures = [...features];
    updatedFeatures[index].status = checked;
    setFeatures(updatedFeatures);
  };

  // Requirement handlers
  const handleAddRequirement = () => {
    if (requirements.length >= MAX_REQUIREMENTS) {
      toast.error(`Maksimal ${MAX_REQUIREMENTS} requirements diperbolehkan`);
      return;
    }
    setRequirements([...requirements, ""]);
  };

  const handleRemoveRequirement = (index: number) => {
    if (requirements.length > 1) {
      const newRequirements = [...requirements];
      newRequirements.splice(index, 1);
      setRequirements(newRequirements);
    }
  };

  const handleRequirementChange = (index: number, value: string) => {
    const updatedRequirements = [...requirements];
    updatedRequirements[index] = value;
    setRequirements(updatedRequirements);
  };

  // Validasi perubahan data
  const hasChanges = (): boolean => {
    if (!originalDataRef.current) return true;
    
    const validFeatures = features.filter(f => f.feature.trim() !== "");
    const validRequirements = requirements.filter(r => r.trim() !== "");
    
    const currentData = {
      type: type.trim(),
      price: price.trim(),
      discount: discount.trim(),
      link: link.trim(),
      highlight,
      serviceId: serviceId.trim(),
      features: validFeatures,
      requirements: validRequirements,
    };

    const original = originalDataRef.current;
    
    return JSON.stringify(currentData) !== JSON.stringify({
      type: original.type?.trim(),
      price: original.price?.trim(),
      discount: original.discount?.trim(),
      link: original.link?.trim(),
      highlight: original.highlight,
      serviceId: original.serviceId?.trim(),
      features: original.features,
      requirements: original.requirements,
    });
  };

  // Validasi form
  const validateForm = (): boolean => {
    // Reset error details
    setErrorDetails(null);

    // Validasi service
    if (!serviceId.trim()) {
      toast.error("Service harus dipilih");
      return false;
    }

    // Validasi type
    if (!type.trim()) {
      toast.error("Type package harus diisi");
      return false;
    }

    // Validasi price
    if (!price.trim()) {
      toast.error("Price harus diisi");
      return false;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error("Price harus berupa angka positif");
      return false;
    }

    // Validasi discount
    if (discount.trim()) {
      const discountNum = parseFloat(discount);
      if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
        toast.error("Discount harus antara 0-100%");
        return false;
      }
    }

    // Validasi link
    if (!link.trim()) {
      toast.error("Link harus diisi");
      return false;
    }

    // Validasi features
    const validFeatures = features.filter(f => f.feature.trim() !== "");
    if (validFeatures.length === 0) {
      toast.error("Minimal harus ada 1 feature yang diisi");
      return false;
    }

    // Validasi jumlah data
    if (validFeatures.length > MAX_FEATURES) {
      toast.error(`Maksimal ${MAX_FEATURES} features diperbolehkan`);
      return false;
    }

    const validRequirements = requirements.filter(r => r.trim() !== "");
    if (validRequirements.length > MAX_REQUIREMENTS) {
      toast.error(`Maksimal ${MAX_REQUIREMENTS} requirements diperbolehkan`);
      return false;
    }

    return true;
  };

  // Fungsi untuk memecah data menjadi batch
  const createBatches = <T,>(array: T[], size: number): T[][] => {
    const batches = [];
    for (let i = 0; i < array.length; i += size) {
      batches.push(array.slice(i, i + size));
    }
    return batches;
  };

  // Update package dengan timeout dan retry
  const updatePackageWithRetry = async (
    payload: OptimizedPayload,
    maxRetries = 3
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    const token = getToken();
    if (!token) {
      return { success: false, error: "Token tidak ditemukan" };
    }

    // Create abort controller untuk timeout
    abortControllerRef.current = new AbortController();
    const timeoutId = setTimeout(() => {
      abortControllerRef.current?.abort();
    }, 30000); // 30 detik timeout

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`🔄 Update attempt ${attempt + 1}/${maxRetries}`);
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/business/packages/${packageId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            signal: abortControllerRef.current.signal,
          }
        );

        clearTimeout(timeoutId);

        const responseData = await response.json();
        console.log(`📩 API Response (attempt ${attempt + 1}):`, {
          status: response.status,
          success: responseData.success,
          message: responseData.message,
        });

        if (!response.ok) {
          throw new Error(
            responseData.message || `HTTP error! status: ${response.status}`
          );
        }

        if (responseData.success) {
          return { success: true, data: responseData.data };
        } else {
          throw new Error(responseData.message || "Gagal mengupdate package");
        }
      } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        lastError = err;
        console.error(`❌ Update attempt ${attempt + 1} failed:`, err);

        // Jika bukan timeout atau abort, tidak usah retry
        if (err.name === "AbortError" || err.message.includes("timeout")) {
          // Coba lagi dengan timeout yang lebih pendek
          if (attempt < maxRetries - 1) {
            const delay = Math.pow(2, attempt) * 1000;
            console.log(`⏳ Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        } else {
          // Untuk error lain, break loop
          break;
        }
      }
    }

    clearTimeout(timeoutId);
    
    return {
      success: false,
      error: lastError?.message || "Unknown error after retries"
    };
  };

  // Handle submit dengan optimasi dan retry
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi perubahan
    if (!hasChanges()) {
      toast.info("Tidak ada perubahan data untuk disimpan");
      return;
    }

    // Validasi form
    if (!validateForm()) {
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error("Token tidak ditemukan. Silakan login kembali.");
      return;
    }

    setIsLoading(true);
    setUploadProgress(10);
    setErrorDetails(null);

    try {
      // Siapkan payload
      const validFeatures = features.filter(f => f.feature.trim() !== "");
      const validRequirements = requirements.filter(r => r.trim() !== "");
      
      const rawPayload = {
        serviceId,
        type,
        price,
        discount,
        link,
        highlight,
        features: validFeatures,
        requirements: validRequirements,
      };

      const payload = optimizePayload(rawPayload);

      console.log("📦 Optimized payload:", {
        ...payload,
        featuresCount: payload.features.length,
        requirementsCount: payload.requirements.length,
      });

      // Tampilkan warning untuk data besar
      const totalItems = payload.features.length + payload.requirements.length;
      if (totalItems > 30) {
        toast.warning(`Mengupdate ${totalItems} item, proses mungkin memakan waktu beberapa detik...`, {
          duration: 5000,
          icon: <AlertCircle className="w-4 h-4" />,
        });
      }

      setUploadProgress(30);

      // Update package dengan retry mechanism
      const result = await updatePackageWithRetry(payload, 3);

      if (result.success) {
        setUploadProgress(100);
        toast.success("Package berhasil diupdate!", {
          icon: <Check className="w-4 h-4" />,
        });
        
        // Update original data ref
        originalDataRef.current = {
          type: payload.type,
          price: payload.price.toString(),
          discount: payload.discount.toString(),
          link: payload.link,
          highlight: payload.highlight,
          serviceId: payload.serviceId.toString(),
          features: payload.features,
          requirements: payload.requirements,
        };
        
        // Delay sebelum redirect untuk user feedback
        await new Promise(resolve => setTimeout(resolve, 500));
        
        router.push("/business/packages");
        router.refresh();
      } else {
        throw new Error(result.error || "Gagal mengupdate package");
      }
    } catch (error: unknown) {
      console.error("❌ Error updating package:", error);
      
      let errorMessage = "Terjadi kesalahan saat mengupdate package";
      let showRetry = true;
      
      const errorMsg = error instanceof Error ? error.message : String(error);
      
      if (errorMsg.includes("AbortError")) {
        errorMessage = "Request timeout. Server terlalu lama merespon.";
        setErrorDetails("Timeout setelah 30 detik. Coba lagi atau kurangi jumlah data.");
      } else if (errorMsg.includes("timeout")) {
        errorMessage = "Koneksi timeout. Periksa jaringan Anda.";
      } else if (errorMsg.includes("Failed to fetch")) {
        errorMessage = "Tidak dapat terhubung ke server.";
      } else if (errorMsg.includes("401")) {
        errorMessage = "Sesi telah berakhir. Silakan login kembali.";
        showRetry = false;
      } else if (errorMsg.includes("404")) {
        errorMessage = "Package tidak ditemukan.";
        showRetry = false;
      } else if (errorMsg.includes("500")) {
        errorMessage = "Server error. Silakan coba lagi nanti.";
        setErrorDetails("Error internal server. Hubungi administrator.");
      } else if (errorMsg.includes("Database")) {
        errorMessage = "Database timeout. Coba lagi dengan data yang lebih sedikit.";
        setErrorDetails("Database operation timeout. Kurangi jumlah features/requirements.");
      } else {
        errorMessage = errorMsg || errorMessage;
      }
      
      toast.error(errorMessage, {
        icon: <X className="w-4 h-4" />,
        duration: 10000,
        action: showRetry ? {
          label: "Coba Lagi",
          onClick: () => handleSubmit(e),
        } : undefined,
      });
      
      setErrorDetails(errorMsg);
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  // Loading state
  if (isFetching) {
    return (
      <Wrapper>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-white" />
          <p className="text-white text-lg">Memuat data package...</p>
          <p className="text-gray-400 text-sm">ID: {packageId}</p>
        </div>
      </Wrapper>
    );
  }

  // Error state
  if (errorDetails && !originalDataRef.current) {
    return (
      <Wrapper>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
          <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-6 max-w-md text-center">
            <X className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-300 mb-2">
              Gagal Memuat Data
            </h2>
            <p className="text-red-200/80 mb-4">{errorDetails}</p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => fetchPackageData()}
                className="border-red-400 text-red-400 hover:bg-red-400/10"
              >
                <Loader2 className="w-4 h-4 mr-2" />
                Coba Lagi
              </Button>
              <Link href="/business/packages">
                <Button className="bg-red-600 hover:bg-red-700">
                  Kembali ke Daftar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }

  // Hitung stats
  const validFeaturesCount = features.filter(f => f.feature.trim() !== "").length;
  const validRequirementsCount = requirements.filter(r => r.trim() !== "").length;
  const totalItems = validFeaturesCount + validRequirementsCount;
  const hasEmptyFields = features.some(f => !f.feature.trim()) || requirements.some(r => !r.trim());

  return (
    <Wrapper>
      {/* Global Progress Bar */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ease-out"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      <div className="space-y-6">
        {/* Header dengan stats */}
        <HeaderActions position="left">
          <div className="flex items-center gap-4">
            <h1 className="text-sm capitalize px-4 py-2 font-semibold bg-black/50 dark:bg-white/10 rounded-full border border-neutral-300/10 text-white">
              Edit Package #{packageId}
            </h1>
            {!hasChanges() && (
              <span className="text-xs px-3 py-1 bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
                <Check className="w-3 h-3 inline mr-1" />
                Tidak ada perubahan
              </span>
            )}
          </div>
        </HeaderActions>

        {/* Header Actions kanan */}
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
              disabled={isLoading || dataServices.length === 0 || !hasChanges()}
              className="min-w-[140px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> 
                  {uploadProgress > 0 ? `${Math.round(uploadProgress)}%` : "Menyimpan..."}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Update Package
                </>
              )}
            </Button>
          </div>
        </HeaderActions>

        {/* Warning untuk data besar */}
        {totalItems > 20 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-yellow-400 mb-1">
                  Data Cukup Besar
                </h3>
                <p className="text-yellow-300/80 text-sm">
                  Anda memiliki {totalItems} item data. Proses update mungkin memakan waktu {Math.ceil(totalItems / 10)}-{Math.ceil(totalItems / 5)} detik.
                  {totalItems > 40 && " Pertimbangkan untuk mengurangi jumlah data untuk performa yang lebih baik."}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <span className="text-yellow-300/70">
                    Features: {validFeaturesCount}/{MAX_FEATURES}
                  </span>
                  <span className="text-yellow-300/70">
                    Requirements: {validRequirementsCount}/{MAX_REQUIREMENTS}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Details */}
        {errorDetails && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-red-400 mb-1">
                  Error Terakhir
                </h3>
                <p className="text-red-300/80 text-sm">{errorDetails}</p>
                <p className="text-red-300/60 text-xs mt-2">
                  Tips: Coba kurangi jumlah features/requirements atau coba lagi nanti.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* No Services Warning */}
        {dataServices.length === 0 && !servicesLoading && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-yellow-400">
                  Tidak ada Services Tersedia
                </h3>
                <p className="text-yellow-300/80 mt-1">
                  Anda perlu membuat service terlebih dahulu sebelum mengedit package.
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

        {/* Main Form */}
        {dataServices.length > 0 && (
          <form
            id="edit-package-form"
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Basic Information */}
            <div className="bg-white/5 text-white rounded-xl p-6 space-y-6 border border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  Informasi Dasar
                </h2>
                <span className="text-xs px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                  Wajib diisi
                </span>
              </div>

              {/* Service Selection */}
              <div className="space-y-3 ">
                <Label className="text-white flex items-center gap-1">
                  Service
                  <span className="text-red-500">*</span>
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
                  Service yang akan dikaitkan dengan package ini
                </p>
              </div>

              {/* Type */}
              <div className="space-y-3 ">
                <Label htmlFor="type" className="text-white flex items-center gap-1">
                  Type Package
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="type"
                  placeholder="e.g., Basic, Premium, Pro"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/20 border-white/20"
                />
              </div>

              {/* Price & Discount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="price" className="text-white flex items-center gap-1">
                    Price (Rp)
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      Rp
                    </span>
                    <Input
                      id="price"
                      type="number"
                      placeholder="150000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      min="0"
                      step="1000"
                      disabled={isLoading}
                      className="bg-white/20 border-white/20 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="discount" className="text-white">
                    Discount (%)
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    placeholder="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    min="0"
                    max="100"
                    disabled={isLoading}
                    className="bg-white/20 border-white/20"
                  />
                  {discount && parseFloat(discount) > 0 && (
                    <p className="text-sm text-green-400">
                      Harga setelah diskon: Rp {(
                        parseFloat(price || "0") * 
                        (1 - parseFloat(discount) / 100)
                      ).toLocaleString('id-ID')}
                    </p>
                  )}
                </div>
              </div>

              {/* Link */}
              <div className="space-y-3">
                <Label htmlFor="link" className="text-white flex items-center gap-1">
                  Link
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="link"
                  type="url"
                  placeholder="https://example.com/order"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/20 border-white/20"
                />
                <p className="text-sm text-gray-400">
                  Link untuk order atau detail package
                </p>
              </div>

              {/* Highlight */}
              <div className="flex items-center space-x-3 p-4 bg-white/20 border-white/20 rounded-lg">
                <Checkbox
                  id="highlight"
                  checked={highlight}
                  onCheckedChange={(checked) =>
                    setHighlight(checked as boolean)
                  }
                  disabled={isLoading}
                />
                <div>
                  <Label
                    htmlFor="highlight"
                    className="text-white cursor-pointer text-sm font-medium"
                  >
                    Highlight Package
                  </Label>
                  <p className="text-white/70 text-xs mt-1">
                    Tampilkan sebagai rekomendasi di halaman utama
                  </p>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-white/5 rounded-sm p-6 space-y-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Features
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Fitur-fitur yang ditawarkan dalam package ini
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-3 py-1 bg-green-500/20 text-green-300 rounded-full">
                    {validFeaturesCount} valid
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddFeature}
                    disabled={features.length >= MAX_FEATURES || isLoading}
                    className="border-green-500 text-green-500 hover:bg-green-500/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Feature
                  </Button>
                </div>
              </div>

              {features.map((feature, index) => (
                <div key={index} className="flex items-start text-white gap-4 ">
                  <div className="flex-1 ">
                    <div className="flex items-center gap-2">
                     
                      {!feature.feature.trim() && (
                        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-xs ">
                          Kosong
                        </span>
                      )}
                    </div>
                    <Input
                      placeholder="Deskripsi fitur..."
                      value={feature.feature}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                      disabled={isLoading}
                      className="bg-white/18 border-white/10 rounded-sm"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`feature-status-${index}`}
                        checked={feature.status}
                        onCheckedChange={(checked) =>
                          handleFeatureStatusChange(index, checked as boolean)
                        }
                        disabled={isLoading}
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
                        disabled={isLoading}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {features.length >= MAX_FEATURES && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-sm text-red-300 text-center">
                    ⚠️ Anda telah mencapai batas maksimum {MAX_FEATURES} features.
                    Hapus beberapa feature sebelum menambahkan yang baru.
                  </p>
                </div>
              )}
            </div>

            {/* Requirements Section */}
            <div className="bg-white/5 rounded-xl p-6 space-y-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Requirements
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Persyaratan yang diperlukan untuk package ini
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                    {validRequirementsCount} valid
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddRequirement}
                    disabled={requirements.length >= MAX_REQUIREMENTS || isLoading}
                    className="border-purple-500 text-purple-500 hover:bg-purple-500/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Requirement
                  </Button>
                </div>
              </div>

              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-black/20 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-white/10 rounded text-gray-300">
                        Requirement {index + 1}
                      </span>
                      {!requirement.trim() && (
                        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                          Kosong
                        </span>
                      )}
                    </div>
                    <Input
                      placeholder="Persyaratan..."
                      value={requirement}
                      onChange={(e) =>
                        handleRequirementChange(index, e.target.value)
                      }
                      disabled={isLoading}
                      className="bg-black/30 border-white/10"
                    />
                  </div>
                  {requirements.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveRequirement(index)}
                      disabled={isLoading}
                      className="mt-8 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}

              {requirements.length >= MAX_REQUIREMENTS && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-sm text-red-300 text-center">
                    ⚠️ Anda telah mencapai batas maksimum {MAX_REQUIREMENTS} requirements.
                    Hapus beberapa requirement sebelum menambahkan yang baru.
                  </p>
                </div>
              )}
            </div>


            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-black/20 rounded-xl border border-white/10">
              <div className="text-sm text-gray-400">
                {hasChanges() ? (
                  <span className="text-yellow-300">
                    ⚠️ Ada perubahan yang belum disimpan
                  </span>
                ) : (
                  <span className="text-green-300">
                    ✓ Semua perubahan telah disimpan
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Link href="/business/packages">
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isLoading}
                    className="border-gray-500 text-gray-400 hover:bg-gray-500/10"
                  >
                    Kembali
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isLoading || !hasChanges()}
                  className="min-w-[160px] bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {uploadProgress > 0 ? `Menyimpan ${Math.round(uploadProgress)}%` : "Menyimpan..."}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </Wrapper>
  );
}