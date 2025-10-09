import { Category, PaginationData } from "@/app/article/category/page";
import { getToken } from "@/lib/helpers";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [dataCategories, setDataCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
  });

  const token = getToken();

  async function fetchDataCategory() {
    if (!token) return;
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(searchQuery && { search: searchQuery }),
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/article/category?${params}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();

      if (data.success) {
        setDataCategories(data.data);
        setPagination(data.pagination);
      }
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : "unknown errors";
      console.log(errMessage);
      toast.error(errMessage);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchDataCategory();
  }, [currentPage, limit, searchQuery]);

  return {
    isLoading,
    pagination,
    token,
    fetchDataCategory,
    currentPage,
    setCurrentPage,
    limit,
    setLimit,
    setSearchQuery,
    dataCategories,
  }
}
