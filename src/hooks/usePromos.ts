"use client";

import { useState, useEffect, useCallback } from "react";
import { getToken } from "@/lib/helpers";

export interface PromoBanner {
  id: number;
  url_desktop: string;
  url_mobile: string;
  url: string;
  alt: string;
  isPopup: boolean;
  createdAt: string;
}

export function usePromos() {
  const token = getToken();

  const [dialogNew, setDialogNew] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<PromoBanner | null>(null);

  const [alt, setAlt] = useState("");
  const [url, setUrl] = useState("");
  const [isPopup, setIsPopup] = useState("inactive");

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
      const response = await fetch("/api/promos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success) setBanners(result.data);
      else alert("Failed to fetch banners: " + result.message);
    } catch (error) {
      console.error("Error fetching banners:", error);
      alert("Error fetching banners");
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
    setIsPopup("inactive");
    setCurrentBanner(null);
    setEditMode(false);
  };

  /** Create / Update Banner */
  const handleSubmit = async () => {
    if (!desktopFile && !editMode) {
      alert("Upload desktop image!");
      return;
    }
    if (!mobileFile && !editMode) {
      alert("Upload mobile image!");
      return;
    }
    if (!alt.trim() || !url.trim()) {
      alert("Alt text & URL harus diisi!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      if (desktopFile) formData.append("desktop_image", desktopFile);
      if (mobileFile) formData.append("mobile_image", mobileFile);

      formData.append("alt", alt);
      formData.append("url", url);
      formData.append("isPopup", isPopup === "active" ? "true" : "false");

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
        alert(`Banner ${editMode ? "updated" : "created"} successfully!`);
      } else {
        alert(`Failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting banner:", error);
      alert("Error submitting banner");
    } finally {
      setLoading(false);
    }
  };

  /** Delete Banner */
  const deleteBanner = async (id: number) => {
    if (!confirm("Delete this banner?")) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/promos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success) {
        await fetchBanners();
        alert("Banner deleted successfully!");
      } else {
        alert("Failed to delete banner: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Error deleting banner");
    } finally {
      setLoading(false);
    }
  };

  /** Set Data Untuk Edit */
  const editBanner = (banner: PromoBanner) => {
    setCurrentBanner(banner);
    setAlt(banner.alt);
    setUrl(banner.url);
    setIsPopup(banner.isPopup ? "active" : "inactive");
    setDesktopPreview(banner.url_desktop);
    setMobilePreview(banner.url_mobile);
    setEditMode(true);
    setDialogNew(true);
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

    alt,
    setAlt,
    url,
    setUrl,
    isPopup,
    setIsPopup,

    desktopFile,
    mobileFile,
    desktopPreview,
    mobilePreview,

    handleDesktopUpload,
    handleMobileUpload,

    banners,
    loading,

    handleSubmit,
    deleteBanner,
    editBanner,
    handleCancel,
  };
}