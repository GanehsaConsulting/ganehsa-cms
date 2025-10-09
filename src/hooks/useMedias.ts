import { Medias } from "@/app/media-library/page";
import { getToken } from "@/lib/helpers";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useMedias() {
  const [medias, setMedias] = useState<Medias[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    currentPage: 1,
  });
  const [fetchFunction, setFetchFunction] = useState<
    ((search?: string, page?: number) => void) | null
  >(null);

  async function getMedias(search: string = "", page: number = 1) {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/media?search=${encodeURIComponent(
          search
        )}&page=${page}&limit=12`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMedias(data.data);
        setPagination({
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
          currentPage: data.pagination.currentPage,
        });
      } else {
        toast.error(data.message || "Gagal mengambil data media");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  const token = getToken();
  useEffect(() => {
    if (!token) return;
    // initial fetch
    getMedias();
    setFetchFunction(() => getMedias);
  }, [token]);

  return {
    token,
    pagination,
    fetchFunction,
    isLoading,
    setIsLoading,
    medias,
    setMedias,
    getMedias
  };
}
