"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// List halaman yang tidak butuh proteksi
const PUBLIC_ROUTES = ["/login", "/register", "/about", "/rating"];

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to check if current path is public
  const isPublicRoute = (path: string): boolean => {
    // Check static public routes
    if (PUBLIC_ROUTES.includes(path)) {
      return true;
    }

    // Check if it's any invoice route (all invoice pages are public)
    if (path.startsWith("/invoice") || path.startsWith("/payment")) {
      return true;
    }

    return false;
  };

  const validateToken = async (): Promise<boolean> => {
    const token = localStorage.getItem("token");

    if (!token) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/whoAmI`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        return !!userData; // Return true jika ada user data
      } else {
        // Token tidak valid atau expired
        localStorage.removeItem("token");
        return false;
      }
    } catch (error) {
      console.error('Error validating token:', error);
      // Jika ada error network, anggap token tidak valid untuk keamanan
      localStorage.removeItem("token");
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      // Jika halaman ini adalah public route, langsung load
      if (isPublicRoute(pathname)) {
        setIsLoaded(true);
        setIsAuthenticated(false);
        return;
      }

      // Untuk protected routes, validasi token
      const isValid = await validateToken();

      if (isValid) {
        setIsAuthenticated(true);
        setIsLoaded(true);
      } else {
        setIsAuthenticated(false);
        setIsLoaded(true);
        router.push("/login");
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Listen untuk perubahan localStorage
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token") {
        if (!event.newValue) {
          // Token dihapus
          setIsAuthenticated(false);
          if (!isPublicRoute(pathname)) {
            router.push("/login");
          }
        } else {
          // Token baru ditambahkan, validasi ulang
          validateToken().then((isValid) => {
            setIsAuthenticated(isValid);
            if (!isValid && !isPublicRoute(pathname)) {
              router.push("/login");
            }
          });
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [pathname, router]);

  // Tampilkan loading atau konten
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen w-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Untuk public routes, selalu tampilkan children
  if (isPublicRoute(pathname)) {
    return children;
  }

  // Untuk protected routes, hanya tampilkan jika authenticated
  if (isAuthenticated) {
    return children;
  }

  // Jika tidak authenticated dan bukan public route, return null
  // (karena sudah redirect ke login)
  return null;
};

export default ProtectedRoutes;
