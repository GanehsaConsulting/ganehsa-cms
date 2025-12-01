// hooks/useWallpaper.ts
import { getToken } from "@/lib/helpers";
import { useState, useEffect } from "react";

interface Wallpaper {
  id: number;
  url: string;
  name: string;
  createdAt: string;
}

export const useWallpaper = () => {
  const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
  const [loading, setLoading] = useState(true);
  const token = getToken()

  const fetchWallpaper = async () => {
    try {
      const response = await fetch("/api/content/wallpapers", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      if (result.success) {
        setWallpaper(result.data);
      }
    } catch (error) {
      console.error("Error fetching wallpaper:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadWallpaper = async (
    file: File,
    name?: string
  ): Promise<boolean> => {
    const formData = new FormData();
    formData.append("file", file);
    if (name) formData.append("name", name);

    try {
      const response = await fetch("/api/content/wallpapers", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setWallpaper(result.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error uploading wallpaper:", error);
      return false;
    }
  };

  const deleteWallpaper = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/content/wallpapers", {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setWallpaper(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting wallpaper:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchWallpaper();
  }, []);

  return {
    wallpaper,
    loading,
    uploadWallpaper,
    deleteWallpaper,
    refetch: fetchWallpaper,
  };
};
