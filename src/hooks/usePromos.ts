"use client";

import { useState, useEffect, useCallback } from "react";
import { getToken } from "@/lib/helpers";
import imageCompression from "browser-image-compression";

export interface PromoBanner {
  id: number;
  url_desktop: string;
  url_mobile: string;
  url: string;
  alt: string;
  // isPopup: boolean;
  createdAt: string;
}

// Fungsi kompresi gambar
const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 1, // Maksimal 1MB setelah kompresi
    maxWidthOrHeight: 1920, // Maksimal resolusi 1920px
    useWebWorker: true,
    fileType: file.type.includes("png") ? "image/png" : "image/jpeg",
    initialQuality: 0.8, // Kualitas 80%
  };

  try {
    console.log(`Kompresi gambar: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    
    const compressedFile = await imageCompression(file, options);
    
    console.log(`Berhasil dikompresi: ${compressedFile.name} (${(compressedFile.size / 1024 / 1024).toFixed(2)}MB)`);
    
    return new File([compressedFile], file.name, {
      type: compressedFile.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("Error compressing image:", error);
    throw new Error("Gagal mengkompresi gambar");
  }
};

// Validasi file
const validateImageFile = (file: File): { isValid: boolean; message?: string } => {
  // Validasi ukuran (maksimal 5MB sebelum kompresi)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      message: `File terlalu besar (${(file.size / 1024 / 1024).toFixed(2)}MB). Maksimal 5MB.`,
    };
  }

  // Validasi tipe file
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"];
  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      message: "Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.",
    };
  }

  return { isValid: true };
};

export function usePromos() {
  const token = getToken();

  const [error, setError] = useState("");
  const [dialogNew, setDialogNew] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<PromoBanner | null>(null);
  
  // State untuk loading dan kompresi
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);

  // State untuk delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<PromoBanner | null>(null);

  const [alt, setAlt] = useState("");
  const [url, setUrl] = useState("");
  // const [isPopup, setIsPopup] = useState("inactive");

  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);

  const [desktopPreview, setDesktopPreview] = useState<string | null>(null);
  const [mobilePreview, setMobilePreview] = useState<string | null>(null);

  const [banners, setBanners] = useState<PromoBanner[]>([]);

  /** Fetch Data */
  const fetchBanners = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/business/promos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success) {
        setBanners(result.data);
      } else {
        setError(result.message || "Failed to fetch banners");
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      setError("Error fetching banners");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  /** Upload desktop dengan kompresi */
  const handleDesktopUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.message || "File tidak valid");
      e.target.value = ""; // Reset input
      return;
    }

    setCompressing(true);
    try {
      // Kompresi gambar
      const compressedFile = await compressImage(file);
      
      // Buat preview dari file yang sudah dikompresi
      const reader = new FileReader();
      reader.onloadend = () => {
        setDesktopPreview(reader.result as string);
        setDesktopFile(compressedFile);
        setError(""); // Clear error jika sebelumnya ada
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error processing desktop image:", error);
      setError("Gagal memproses gambar desktop");
      e.target.value = ""; // Reset input
    } finally {
      setCompressing(false);
    }
  };

  /** Upload mobile dengan kompresi */
  const handleMobileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.message || "File tidak valid");
      e.target.value = ""; // Reset input
      return;
    }

    setCompressing(true);
    try {
      // Kompresi gambar
      const compressedFile = await compressImage(file);
      
      // Buat preview dari file yang sudah dikompresi
      const reader = new FileReader();
      reader.onloadend = () => {
        setMobilePreview(reader.result as string);
        setMobileFile(compressedFile);
        setError(""); // Clear error jika sebelumnya ada
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error processing mobile image:", error);
      setError("Gagal memproses gambar mobile");
      e.target.value = ""; // Reset input
    } finally {
      setCompressing(false);
    }
  };

  /** Reset Form */
  const resetForm = () => {
    setDesktopFile(null);
    setMobileFile(null);
    setDesktopPreview(null);
    setMobilePreview(null);
    setAlt("");
    setUrl("");
    // setIsPopup("inactive");
    setCurrentBanner(null);
    setEditMode(false);
    setError("");
    setCompressing(false);
  };

  /** Create / Update Banner */
  const handleSubmit = async () => {
    // Validasi: hanya mobile image yang required untuk create
    if (!mobileFile && !editMode) {
      setError("Mobile image is required!");
      return;
    }
    
    if (!alt.trim() || !url.trim()) {
      setError("Alt text & URL harus diisi!");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const formData = new FormData();

      // Desktop image optional - hanya append jika ada file baru
      if (desktopFile) {
        formData.append("desktop_image", desktopFile);
        console.log("Desktop file size:", `${(desktopFile.size / 1024).toFixed(2)}KB`);
      }
      
      // Mobile image required untuk create, optional untuk edit
      if (mobileFile) {
        formData.append("mobile_image", mobileFile);
        console.log("Mobile file size:", `${(mobileFile.size / 1024).toFixed(2)}KB`);
      }

      formData.append("alt", alt);
      formData.append("url", url);
      // formData.append("isPopup", isPopup === "active" ? "true" : "false");

      const endpoint =
        editMode && currentBanner
          ? `/api/business/promos/${currentBanner.id}`
          : "/api/business/promos";

      const method = editMode ? "PATCH" : "POST";

      console.log(`Submitting to ${endpoint} with method ${method}`);

      const response = await fetch(endpoint, {
        method,
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Cek jika response adalah 413 (Payload Too Large)
      if (response.status === 413) {
        throw new Error("Gambar terlalu besar. Silakan gunakan gambar yang lebih kecil atau coba lagi.");
      }

      const result = await response.json();

      if (result.success) {
        await fetchBanners();
        resetForm();
        setDialogNew(false);
      } else {
        setError(result.message || `Failed to ${editMode ? "update" : "create"} banner`);
      }
    } catch (error) {
      console.error("Error submitting banner:", error);
      
    } finally {
      setLoading(false);
    }
  };

  /** Delete Banner */
  const deleteBanner = async (id: number) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`/api/business/promos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success) {
        await fetchBanners();
        setDeleteDialogOpen(false);
        setBannerToDelete(null);
      } else {
        setError(result.message || "Failed to delete banner");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      setError("Error deleting banner");
    } finally {
      setLoading(false);
    }
  };

  /** Set Data Untuk Edit */
  const editBanner = (banner: PromoBanner) => {
    setCurrentBanner(banner);
    setAlt(banner.alt);
    setUrl(banner.url);
    // setIsPopup(banner.isPopup ? "active" : "inactive");
    
    // Set preview dari URL yang sudah ada
    setDesktopPreview(banner.url_desktop || null);
    setMobilePreview(banner.url_mobile || null);
    
    // Reset file karena ini edit mode
    setDesktopFile(null);
    setMobileFile(null);
    
    setEditMode(true);
    setDialogNew(true);
    setError("");
  };

  /** Open Delete Confirmation Dialog */
  const openDeleteDialog = (banner: PromoBanner) => {
    setBannerToDelete(banner);
    setDeleteDialogOpen(true);
  };

  /** Close Delete Confirmation Dialog */
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setBannerToDelete(null);
  };

  const handleCancel = () => {
    resetForm();
    setDialogNew(false);
  };

  return {
    dialogNew,
    setDialogNew,
    editMode,
    currentBanner,
    error,
    alt,
    setAlt,
    url,
    setUrl,
    // isPopup,
    // setIsPopup,

    desktopFile,
    mobileFile,
    desktopPreview,
    mobilePreview,

    handleDesktopUpload,
    handleMobileUpload,

    banners,
    loading: loading || compressing, // Gabungkan loading dan compressing state
    compressing, // State khusus untuk kompresi

    handleSubmit,
    deleteBanner: openDeleteDialog, // sekarang ini membuka dialog
    confirmDelete: deleteBanner, // ini untuk eksekusi delete
    editBanner,
    handleCancel,

    // Delete dialog state
    deleteDialogOpen,
    setDeleteDialogOpen,
    bannerToDelete,
    closeDeleteDialog,
  };
}