
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getToken } from "@/lib/helpers";
import { TableClient } from "@/app/business/clients/page";

interface FetchClientsParams {
  page?: number;
  limit?: number;
  search?: string;
  serviceFilter?: string;
}

export function useClients() {
  const [clients, setClients] = useState<TableClient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [serviceFilter, setServiceFilter] = useState("All Services");
  const pageLength = ["5", "10", "20", "50"];
  const token = getToken();

  const fetchClients = useCallback(
    async (params: FetchClientsParams = {}) => {
      if (!token) {
        console.warn("No token available");
        return;
      }

      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: params.page?.toString() || page.toString(),
          limit: params.limit?.toString() || limit.toString(),
          ...(params.search !== undefined && { search: params.search }),
          ...(params.serviceFilter !== undefined && { serviceFilter: params.serviceFilter }),
        });

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/clients?${queryParams}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.success) {
          setClients(data.data || []);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 1);
          // Update state if new values were provided
          if (params.page !== undefined) setPage(params.page);
          if (params.limit !== undefined) setLimit(params.limit);
          if (params.search !== undefined) setSearchQuery(params.search);
          if (params.serviceFilter !== undefined) setServiceFilter(params.serviceFilter);
        } else {
          toast.error(data.message || "Failed to fetch clients");
        }
      } catch (err) {
        const errMsg =
          err instanceof Error ? err.message : "Unknown error occurred";
        toast.error(errMsg);
        console.error("Fetch clients error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [token, page, limit] // Added dependencies
  );

  // Debounced search
  useEffect(() => {
    if (token) {
      const timeoutId = setTimeout(() => {
        fetchClients({ search: searchQuery, page: 1 }); // Reset to page 1 when searching
      }, 300); // 300ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, token, fetchClients]);

  // Fetch when page, limit, or service filter changes
  useEffect(() => {
    if (token) {
      fetchClients();
    }
  }, [page, limit, serviceFilter, token, fetchClients]);

  // Function to refresh clients
  const refreshClients = useCallback(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
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
    serviceFilter,
    setServiceFilter,
    fetchClients,
    refreshClients,
    token,
  };
}