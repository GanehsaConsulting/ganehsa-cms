// hooks/usePackages.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getToken } from "@/lib/helpers";
import { TablePackages } from "@/app/business/packages/page";

interface PackagesResponse {
  status: number;
  success: boolean;
  message: string;
  data: TablePackages[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const usePackages = () => {
  const [token, setToken] = useState<string | null>(null);
  const [packages, setPackages] = useState<TablePackages[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [typeFilter, setTypeFilter] = useState("All");
  const [highlightFilter, setHighlightFilter] = useState("All");

  const pageLength = ["10", "25", "50", "100"];
  const highlightArr = ["All", "Active", "Inactive"];
  const typeArr = ["All", "Basic", "Premium", "Pro"];

  const fetchPackages = async (
    token: string,
    currentPage: number,
    currentLimit: number,
    search: string,
    type: string,
    highlight: string
  ) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: currentLimit.toString(),
      });

      if (search) {
        params.append("search", search);
      }

      if (type && type !== "All") {
        params.append("type", type);
      }

      if (highlight === "Active") {
        params.append("highlight", "true");
      } else if (highlight === "Inactive") {
        params.append("highlight", "false");
      }

      // PERBAIKAN 1: Gunakan endpoint yang konsisten dengan Postman
      const apiUrl = `/api/package?${params.toString()}`;
      
      console.log("🔍 Fetching packages from:", apiUrl);
      console.log("🔑 Token:", token ? "Present" : "Missing");

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      console.log("📡 Response status:", response.status);

      // PERBAIKAN 2: Cek apakah response adalah HTML (404 page)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        console.error("❌ Received HTML instead of JSON");
        throw new Error('Endpoint tidak ditemukan. Pastikan route /api/package sudah dibuat.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error Response:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: PackagesResponse = await response.json();
      console.log("✅ Packages fetched:", data.data?.length || 0, "items");

      if (data.success) {
        setPackages(data.data || []);
        setTotal(data.pagination?.totalItems || 0);
        setTotalPages(data.pagination?.totalPages || 0);
      } else {
        throw new Error(data.message || "Gagal mengambil data packages");
      }
    } catch (error) {
      console.error("💥 Error fetching packages:", error);
      
      // PERBAIKAN 3: Error handling yang lebih spesifik
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        toast.error("Tidak dapat terhubung ke server. Periksa koneksi jaringan Anda.");
      } else if (error instanceof Error) {
        if (error.message.includes('Endpoint tidak ditemukan')) {
          toast.error("Route /api/package tidak ditemukan. Hubungi developer.");
        } else if (error.message.includes('401')) {
          toast.error("Token tidak valid. Silakan login kembali.");
        } else if (error.message.includes('403')) {
          toast.error("Anda tidak memiliki akses ke resource ini.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Terjadi kesalahan tidak terduga.");
      }
      
      // Set empty state on error
      setPackages([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initToken = getToken();
    if (initToken) {
      setToken(initToken);
      console.log("🔑 Token initialized");
    } else {
      console.warn("⚠️ No token found");
    }
  }, []);

  useEffect(() => {
    if (token) {
      console.log("🚀 Fetching packages with params:", { page, limit, searchQuery, typeFilter, highlightFilter });
      fetchPackages(token, page, limit, searchQuery, typeFilter, highlightFilter);
    }
  }, [token, page, limit, searchQuery, typeFilter, highlightFilter]);

  return {
    token,
    packages,
    isLoading,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,
    pageLength,
    highlightArr,
    highlightFilter,
    setHighlightFilter,
    typeArr,
    typeFilter,
    setTypeFilter,
    fetchPackages,
  };
};