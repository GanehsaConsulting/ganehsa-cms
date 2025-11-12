// hooks/usePackages.ts
import { useState, useEffect, useCallback } from "react";
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

export const usePackages = (initialServiceId?: number) => {
  const [token, setToken] = useState<string | null>(null);
  const [packages, setPackages] = useState<TablePackages[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [serviceFilter, setServiceFilter] = useState("All");
  const [highlightFilter, setHighlightFilter] = useState("All");
  const [serviceIdFilter, setServiceIdFilter] = useState<number | null>(initialServiceId || null);

  const pageLength = ["10", "25", "50", "100"];
  const highlightArr = ["All", "Active", "Inactive"];

  const fetchPackages = useCallback(async (
    currentToken: string,
    currentPage: number,
    currentLimit: number,
    search: string,
    serviceSlug: string,
    highlight: string,
    serviceId: number | null = null
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

      // Priority: serviceId over serviceSlug
      if (serviceId) {
        params.append("serviceId", serviceId.toString());
      } else if (serviceSlug && serviceSlug !== "All") {
        params.append("serviceSlug", serviceSlug);
      }

      if (highlight === "Active") {
        params.append("highlight", "true");
      } else if (highlight === "Inactive") {
        params.append("highlight", "false");
      }

      const apiUrl = `/api/packages?${params.toString()}`;
      
      console.log("🔍 Fetching packages with serviceId:", serviceId);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('Packages endpoint not found.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error Response:", errorText);
        
        if (response.status === 401) {
          throw new Error("Authentication failed. Please login again.");
        } else if (response.status === 403) {
          throw new Error("You don't have permission to access this resource.");
        } else if (response.status === 404) {
          throw new Error("Packages endpoint not found.");
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const data: PackagesResponse = await response.json();
      console.log("✅ Packages fetched successfully:", data.data?.length || 0, "items");

      if (data.success && data.data) {
        // Filter client-side untuk memastikan hanya packages dengan serviceId yang benar
        const filteredPackages = serviceId 
          ? data.data.filter(pkg => {
              const p = pkg as unknown as Record<string, unknown>;
              const serviceIdValue =
                typeof p["serviceId"] === "number"
                  ? (p["serviceId"] as number)
                  : typeof p["service_id"] === "number"
                  ? (p["service_id"] as number)
                  : undefined;
              return serviceIdValue === serviceId;
            })
          : data.data;

        setPackages(filteredPackages);
        setTotal(data.pagination?.totalItems || 0);
        setTotalPages(data.pagination?.totalPages || 0);
      } else {
        throw new Error(data.message || "Failed to fetch packages data");
      }
    } catch (error) {
      console.error("💥 Error fetching packages:", error);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        toast.error("Cannot connect to server. Please check your network connection.");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      
      setPackages([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize token
  useEffect(() => {
    const initToken = getToken();
    if (initToken) {
      setToken(initToken);
    } else {
      toast.error("Please login to access packages");
    }
  }, []);

  // Fetch packages when dependencies change - dengan debounce untuk search
  useEffect(() => {
    if (token) {
      const timeoutId = setTimeout(() => {
        console.log("🚀 Fetching packages with serviceId:", serviceIdFilter);
        fetchPackages(
          token, 
          page, 
          limit, 
          searchQuery, 
          serviceFilter, 
          highlightFilter,
          serviceIdFilter
        );
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [token, page, limit, searchQuery, serviceFilter, highlightFilter, serviceIdFilter, fetchPackages]);

  // Helper function to fetch packages with specific serviceId
  const fetchPackagesByServiceId = useCallback((serviceId: number) => {
    setServiceIdFilter(serviceId);
    setPage(1);
  }, []);

  // Helper function to clear serviceId filter
  const clearServiceIdFilter = useCallback(() => {
    setServiceIdFilter(null);
  }, []);

  return {
    // State
    token,
    packages,
    isLoading,
    searchQuery,
    page,
    limit,
    total,
    totalPages,
    serviceFilter,
    highlightFilter,
    serviceIdFilter,
    
    // Setters
    setSearchQuery,
    setPage,
    setLimit,
    setServiceFilter,
    setHighlightFilter,
    setServiceIdFilter,
    
    // Helpers
    pageLength,
    highlightArr,
    
    // Functions
    fetchPackages: useCallback((params?: {
      page?: number;
      limit?: number;
      search?: string;
      serviceSlug?: string;
      highlight?: string;
      serviceId?: number;
    }) => {
      if (params?.page !== undefined) setPage(params.page);
      if (params?.limit !== undefined) setLimit(params.limit);
      if (params?.search !== undefined) setSearchQuery(params.search);
      if (params?.serviceSlug !== undefined) setServiceFilter(params.serviceSlug);
      if (params?.highlight !== undefined) setHighlightFilter(params.highlight);
      if (params?.serviceId !== undefined) setServiceIdFilter(params.serviceId);
    }, []),
    
    fetchPackagesByServiceId,
    clearServiceIdFilter,
  };
};