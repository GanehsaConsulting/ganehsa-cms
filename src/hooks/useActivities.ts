import { TableActivity } from "@/app/activity/page";
import { getToken } from "@/lib/helpers";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "./useDebounce";

// Define proper types for the media item structure
interface ActivityMediaItem {
  media: {
    url: string;
    id: number;
    type: string;
    title: string | null;
    alt: string | null;
    size: number;
  };
}

export function useActivities() {
  const showTitleArr = ["All", "Showing Title", "Not Showing Title"];
  const pageLength = ["10", "20", "100"];
  const [showTitleFilter, setShowTitleFilter] = useState("All");

  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState<TableActivity[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const token = getToken();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchActivities = useCallback(
    async (
      token: string,
      page: number = 1,
      limit: number = 10,
      search: string = "",
      showTitle: string = ""
    ) => {
      if (!token) {
        toast.error("Token tidak ditemukan");
        return;
      }
      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
        });

        // Add showTitle filter based on selection
        if (showTitle === "Showing Title") {
          params.append("showTitle", "true");
        } else if (showTitle === "Not Showing Title") {
          params.append("showTitle", "false");
        }
        // If showTitle is "All", don't add any showTitle filter

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/activity?${params}`,
          {
            method: "GET",
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
          // Use proper typing instead of 'any'
          const transformedData = data.data.map((activity: TableActivity & { medias: ActivityMediaItem[] }) => ({
            ...activity,
            medias: activity.medias.map(
              (mediaItem: ActivityMediaItem) => mediaItem.media.url
            ),
          }));

          setActivities(transformedData);
          setTotal(data.pagination.total);
          setTotalPages(data.pagination.totalPages);
        } else {
          toast.error(data.message || "Failed to fetch activities");
        }
      } catch (err) {
        const errMsg =
          err instanceof Error ? err.message : "Unknown error occurred";
        toast.error(errMsg);
        console.error("Fetch activities error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (token) {
      fetchActivities(
        token,
        page,
        limit,
        debouncedSearchQuery,
        showTitleFilter
      );
    }
  }, [
    page,
    limit,
    debouncedSearchQuery,
    showTitleFilter,
    fetchActivities,
    token, // Added token to dependencies
  ]);

  return {
    token,
    setSearchQuery,
    setPage,
    fetchActivities,
    page,
    limit,
    setLimit,
    searchQuery,
    showTitleArr,
    showTitleFilter,
    setShowTitleFilter,
    total,
    totalPages,
    pageLength,
    isLoading,
    activities
  }
}