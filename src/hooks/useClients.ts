import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getToken } from "@/lib/helpers";
import { TableClient } from "@/app/business/clients/page";

export function useClients() {
  const [clients, setClients] = useState<TableClient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const pageLength = ["5", "10", "20", "50"];
  const serviceFilterArr = ["All Services"];
  const token = getToken();

  const fetchClients = useCallback(
    async (
      token: string,
      page: number = 1,
      limit: number = 10,
      search: string = ""
      // serviceFilter: string = "All Services"
    ) => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
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
    []
  );

  // Auto fetch on mount and when dependencies change
  useEffect(() => {
    if (token) {
      fetchClients(token as string, page, limit, searchQuery);
    }
  }, [page, limit, searchQuery, token, fetchClients]);

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
    serviceFilterArr,
    fetchClients,
    token,
  };
}
