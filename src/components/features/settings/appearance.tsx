"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

const WALLPAPER_STORAGE_KEY = "user_wallpaper";

// Helper function to dispatch wallpaper update event
const dispatchWallpaperUpdate = (url: string) => {
  window.dispatchEvent(
    new CustomEvent("wallpaperUpdated", { detail: { url } })
  );
};

export const AppearanceSettings = ({ token }: {token: string}) => {
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Get current wallpaper from localStorage first, then verify with API
  useEffect(() => {
    // Load from localStorage immediately
    const cached = localStorage.getItem(WALLPAPER_STORAGE_KEY);
    if (cached) {
      setPreview(cached);
    }

    // Then fetch from API to ensure it's up to date
    const fetchWallpaper = async () => {
      try {
        const response = await fetch("/api/wallpapers", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setPreview(result.data.url);
            localStorage.setItem(WALLPAPER_STORAGE_KEY, result.data.url);
          }
        }
      } catch (error) {
        console.error("Error fetching wallpaper:", error);
      }
    };

    fetchWallpaper();
  }, [token]);


  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("File type not allowed. Only images are permitted.");
      return;
    }

    // Validasi file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large. Maximum 5MB.");
      return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setPreview(result);
      }
    };
    reader.readAsDataURL(file);

    // Upload ke server
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/wallpapers", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Wallpaper berhasil diupload!");
        const newUrl = result.data.url;

        // Update preview dengan URL dari Cloudinary
        setPreview(newUrl);

        // Save to localStorage
        localStorage.setItem(WALLPAPER_STORAGE_KEY, newUrl);

        // Dispatch event to update background in other components
        dispatchWallpaperUpdate(newUrl);
      } else {
        toast.error(result.message || "Gagal mengupload wallpaper");
        // Reset preview jika upload gagal
        setPreview("");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Terjadi kesalahan saat upload");
      setPreview("");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteWallpaper = async () => {
    if (!confirm("Hapus wallpaper?")) return;

    setLoading(true);
    try {
      const response = await fetch("/api/wallpapers", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Wallpaper berhasil dihapus!");

        const defaultWallpaper =
          "https://i.pinimg.com/1200x/7a/f8/8c/7af88c637dd18de57bf938dec31c2248.jpg";

        setPreview("");

        // Update localStorage
        localStorage.setItem(WALLPAPER_STORAGE_KEY, defaultWallpaper);

        // Dispatch event to reset background
        dispatchWallpaperUpdate(defaultWallpaper);
      } else {
        toast.error(result.message || "Gagal menghapus wallpaper");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Terjadi kesalahan saat menghapus wallpaper");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <h1 className="text-white text-xl font-semibold">Change Background</h1>
        <p className="text-white/60 italic text-sm">
          Fitur ini hanya mengubah tampilan cms sesuai preferensi anda, tanpa
          mengubah tampilan cms user yang lain
        </p>
      </div>

      <div className="bg-white/10 border border-white/20 p-4 rounded-xl ">
        <div className="mb-4">
          <p className="text-white text-sm mb-5">Upload wallpaper baru:</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
        </div>

        {uploading && (
          <div className="text-blue-400 text-sm">Mengupload wallpaper...</div>
        )}
      </div>

      {preview && (
        <div className="bg-white/10 border border-white/20 p-4 rounded-xl">
          <p className="text-white mb-2">Preview:</p>
          <div className="relative">
            <img
              src={preview}
              alt="Wallpaper Preview"
              className="w-full max-w-lg rounded-lg border border-white/30"
            />
            <button
              onClick={handleDeleteWallpaper}
              disabled={loading}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white/10 border border-white/20 p-4 rounded-xl">
        <p className="text-white text-sm mb-2">Informasi:</p>
        <ul className="text-gray-300 text-sm list-disc list-inside space-y-1">
          <li>Format yang didukung: JPEG, JPG, PNG, GIF, WebP</li>
          <li>Ukuran maksimal: 5MB</li>
          <li>Wallpaper akan terlihat di semua halaman</li>
          <li>Setiap admin memiliki wallpaper sendiri-sendiri</li>
        </ul>
      </div>
    </>
  );
};
