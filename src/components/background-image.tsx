"use client";
import { getToken } from "@/lib/helpers";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const defaultWallpaper =
  "https://i.pinimg.com/1200x/7a/f8/8c/7af88c637dd18de57bf938dec31c2248.jpg";

const WALLPAPER_STORAGE_KEY = "user_wallpaper";

export const BackgroundImage = () => {
  const pathname = usePathname();
  const is404 = pathname === "/404" || pathname.includes("/not-found");
  const token = getToken();

  // Initialize from localStorage if available
  const [bgSrc, setBgSrc] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(WALLPAPER_STORAGE_KEY);
      return cached || defaultWallpaper;
    }
    return defaultWallpaper;
  });
  
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchWallpaper = async () => {
      if (!token) {
        console.log("No token available");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("/api/content/wallpapers", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Wallpaper fetch response:", response.status);

        if (response.ok) {
          const result = await response.json();
          console.log("Wallpaper data:", result);
          
          if (result.success && result.data?.url) {
            const newUrl = result.data.url;
            setBgSrc(newUrl);
            // Save to localStorage
            localStorage.setItem(WALLPAPER_STORAGE_KEY, newUrl);
            setImageError(false);
          } else {
            setBgSrc(defaultWallpaper);
            localStorage.setItem(WALLPAPER_STORAGE_KEY, defaultWallpaper);
          }
        } else {
          console.log("Wallpaper fetch failed, using default");
          setBgSrc(defaultWallpaper);
          localStorage.setItem(WALLPAPER_STORAGE_KEY, defaultWallpaper);
        }
      } catch (error) {
        console.error("Error fetching wallpaper:", error);
        setBgSrc(defaultWallpaper);
        localStorage.setItem(WALLPAPER_STORAGE_KEY, defaultWallpaper);
      } finally {
        setLoading(false);
      }
    };

    fetchWallpaper();
  }, [token]);

  // Listen for storage events (wallpaper updates from other tabs/components)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === WALLPAPER_STORAGE_KEY && e.newValue) {
        console.log("Storage changed:", e.newValue);
        setBgSrc(e.newValue);
        setImageError(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Listen for custom events (for same-tab updates)
  useEffect(() => {
    const handleWallpaperUpdate = ((e: CustomEvent) => {
      if (e.detail?.url) {
        console.log("Wallpaper updated via event:", e.detail.url);
        setBgSrc(e.detail.url);
        localStorage.setItem(WALLPAPER_STORAGE_KEY, e.detail.url);
        setImageError(false);
      }
    }) as EventListener;

    window.addEventListener("wallpaperUpdated", handleWallpaperUpdate);
    return () => window.removeEventListener("wallpaperUpdated", handleWallpaperUpdate);
  }, []);

  if (is404)
    return (
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-mainColor/20 via-darkColor to-black flex items-center justify-center">
        {/* 404 element */}
      </div>
    );

  // Show loading only if we don't have any cached wallpaper
  if (loading && !bgSrc) {
    return (
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-mainColor/20 via-darkColor to-black">
        <div className="absolute inset-0 bg-black/35"></div>
      </div>
    );
  }

  // If image error, show gradient background
  if (imageError) {
    return (
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-mainColor/20 via-darkColor to-black">
        <div className="absolute inset-0 bg-black/35"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0">
      <Image
        src={bgSrc}
        alt="Background"
        fill
        priority
        unoptimized // Disable Next.js image optimization to avoid external URL issues
        className=" object-cover"
        style={{ objectFit: "cover" }}
        onError={() => {
          console.error("Image failed to load:", bgSrc);
          // Fallback ke default jika gambar error
          setImageError(true);
          setBgSrc(defaultWallpaper);
          localStorage.setItem(WALLPAPER_STORAGE_KEY, defaultWallpaper);
        }}
        onLoad={() => {
          console.log("Image loaded successfully:", bgSrc);
        }}
      />
      <div className="absolute inset-0 bg-black/35"></div>
    </div>
  );
};