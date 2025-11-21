"use client";

import { useState, useEffect, useCallback } from "react";
import { getToken } from "@/lib/helpers";

export interface PromoBanner {
  id: number;
  url_desktop: string;
  url_mobile: string;
  url: string;
  alt: string;
  // isPopup: boolean;
  createdAt: string;
}

export function usePromos() {
  const token = getToken();

  const [error, setError] = useState("");
  const [dialogNew, setDialogNew] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<PromoBanner | null>(null);

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
  const [loading, setLoading] = useState(false);

  /** Fetch Data */
  const fetchBanners = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/promos", {
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

  /** Upload desktop */
  const handleDesktopUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDesktopFile(file);
    setDesktopPreview(URL.createObjectURL(file));
  };

  /** Upload mobile */
  const handleMobileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMobileFile(file);
    setMobilePreview(URL.createObjectURL(file));
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
  };

  /** Create / Update Banner */
  const handleSubmit = async () => {
    // Validasi: hanya mobile image yang required
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
      }
      
      // Mobile image required untuk create, optional untuk edit
      if (mobileFile) {
        formData.append("mobile_image", mobileFile);
      }

      formData.append("alt", alt);
      formData.append("url", url);
      // formData.append("isPopup", isPopup === "active" ? "true" : "false");

      const endpoint =
        editMode && currentBanner
          ? `/api/promos/${currentBanner.id}`
          : "/api/promos";

      const method = editMode ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

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
      setError("Error submitting banner");
    } finally {
      setLoading(false);
    }
  };

  /** Delete Banner */
  const deleteBanner = async (id: number) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`/api/promos/${id}`, {
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
    setDesktopPreview(banner.url_desktop);
    setMobilePreview(banner.url_mobile);
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
    loading,

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