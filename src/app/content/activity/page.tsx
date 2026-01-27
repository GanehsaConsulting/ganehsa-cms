"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wrapper } from "@/components/wrapper";
import { SelectComponent } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus } from "lucide-react";
import { TableList, Column } from "@/components/table-list";
import clsx from "clsx";
import { useState, useEffect } from "react"; // Tambahkan useEffect
import Link from "next/link";
import { TableSkeleton } from "@/components/skeletons/table-list";
import { MdInsertPhoto, MdOutlineLoop } from "react-icons/md";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation"; // Tambahkan useSearchParams
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { getToken, stripHtmlTags } from "@/lib/helpers";
import { useActivities } from "@/hooks/useActivities";
import { AiFillDollarCircle } from "react-icons/ai";
import Image from "next/image";

export interface TableActivity {
  id: number;
  title: string;
  longDesc: string;
  date: string;
  showTitle: boolean;
  isPromo: boolean;
  instaUrl: string;
  medias: string[];
  status: string;
  createdAt: string;
  author: {
    id: number;
    name: string;
    email: string;
  };
}

const activityColumns: Column<TableActivity>[] = [
  { key: "id", label: "ID", className: "font-semibold w-[30]" },
  { key: "title", label: "Title", className: "font-semibold min-w-[200px]" },
  { 
    key: "longDesc", 
    label: "Description", 
    className: "min-w-[190px]",
    render: (row) => {
      const plainText = stripHtmlTags(row.longDesc);
      const maxLength = 100;
      const truncated = plainText.length > maxLength 
        ? plainText.substring(0, maxLength) + "..." 
        : plainText;
      
      return <span className="text-sm text-gray-700">{truncated}</span>;
    }
  },
  {
    key: "isPromo",
    label: "Status Image",
    className: "w-[130px]",
    render: (row) =>
      row.isPromo ? (
        <div className="flex items-center gap-1 font-semibold w-fit py-1 px-2 rounded-full text-red-700 dark:text-white/80 bg-red-200/20 ">
          <AiFillDollarCircle/>
          <p>Promo</p>
        </div>
      ) : (
        <div className="flex items-center gap-1 font-semibold w-fit py-1 px-2 rounded-full text-yellow-700 dark:text-white/80 bg-yellow-200/20 ">
          <MdInsertPhoto />
          <p>Activity</p>
        </div>
      ),
  },
  {
    key: "date",
    label: "Date & Time",
    className: "w-[210px]",
  },
  {
    key: "showTitle",
    label: "Show Title",
    className: "w-[130px]",
    render: (row) => (
      <div className="flex items-center gap-2 bg-lightColor/20 px-2 py-1 rounded-md w-fit">
        <span
          className={clsx(
            "h-2 w-2 rounded-full",
            row.showTitle ? "bg-green-600" : "bg-red-700"
          )}
        />
        <span className="font-medium">
          {row.showTitle ? "Active" : "Inactive"}
        </span>
      </div>
    ),
  },
  {
    key: "instaUrl",
    label: "Instagram URL",
    className: "w-[180px] truncate",
    render: (row) => (
      <a
        href={row.instaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline truncate block max-w-[150px]"
      >
        {row.instaUrl || "-"}
      </a>
    ),
  },
  {
    key: "medias",
    label: "Images",
    className: "w-[160px]",
    render: (row) => (
      <div className="flex gap-1">
        {row.medias.slice(0, 3).map((media, index) => (
          <div key={index} className="w-8 h-8 rounded overflow-hidden">
            <Image
              src={media}
              alt={`Media ${index + 1}`}
              width={32}
              height={32}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        ))}
        {row.medias.length > 3 && (
          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">
            +{row.medias.length - 3}
          </div>
        )}
      </div>
    ),
  },
];

export default function ActivityPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Tambahkan useSearchParams
  
  // Initialize state from URL params
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );

  // Use Activities hook
  const {
    token,
    setSearchQuery,
    setPage,
    fetchActivities,
    page,
    limit,
    setLimit,
    searchQuery,
    filterStatusArr, 
    statusFilter, 
    setStatusFilter, 
    total,
    totalPages,
    pageLength,
    isLoading,
    activities,
  } = useActivities();

  // Alert dialog state
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [selectedActivity, setSelectedActivity] =
    useState<TableActivity | null>(null);

  // Sync URL dengan state filtering dan pagination
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    
    if (statusFilter && statusFilter !== "All") {
      params.set("statusFilter", statusFilter);
    } else {
      params.delete("statusFilter");
    }
    
    if (page !== 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    
    if (limit !== 10) {
      params.set("limit", limit.toString());
    } else {
      params.delete("limit");
    }
    
    // Update URL tanpa refresh
    const newUrl = `/content/activity${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl, { scroll: false });
  }, [searchQuery, statusFilter, page, limit, router, searchParams]);

  // Initialize dari URL pada mount
  useEffect(() => {
    const search = searchParams.get("search");
    const status = searchParams.get("statusFilter");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    
    if (search) {
      setSearchQuery(search);
      setSearchInput(search);
    }
    
    if (status) {
      setStatusFilter(status);
    }
    
    if (pageParam) {
      setPage(parseInt(pageParam));
    }
    
    if (limitParam) {
      setLimit(parseInt(limitParam));
    }
  }, []); // Hanya dijalankan sekali pada mount

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleRefresh = () => {
    if (token) {
      fetchActivities(token, page, limit, searchQuery, statusFilter);
    }
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleLimitChange = (value: string) => {
    setLimit(parseInt(value));
    setPage(1);
  };

  // Update handleEdit untuk menyimpan query params saat ini
  const handleEdit = (row: TableActivity) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    router.push(`/content/activity/${row.id}/edit?return=${encodeURIComponent(currentParams.toString())}`);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedActivity) return;

    const token = getToken();
    if (!token) {
      toast.error("Token tidak ditemukan");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/content/activity/${selectedActivity.id}`,
        {
          method: "DELETE",
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
        toast.success(
          `Activity "${selectedActivity.title}" deleted successfully!`
        );

        // Refresh data tanpa reload page
        const token = getToken();
        if (token) {
          await fetchActivities(
            token,
            page,
            limit,
            searchQuery,
            statusFilter
          );
        }
      } else {
        toast.error(data.message || "Failed to delete activity");
      }
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Unknown error occurred";
      toast.error(errMsg);
      console.error("Delete activity error:", err);
    } finally {
      setShowAlertDelete(false);
      setSelectedActivity(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setPage(1);
  };

  // Buat URL untuk Add New Activity dengan query params
  const addActivityUrl = `/content/activity/new?return=${encodeURIComponent(searchParams.toString())}`;

  return (
    <>
      {/* Alert Dialog for Delete Confirmation */}
      {showAlertDelete && selectedActivity && (
        <AlertDialogComponent
          open={showAlertDelete}
          onOpenChange={(open) => {
            setShowAlertDelete(open);
            if (!open) {
              setSelectedActivity(null);
            }
          }}
          header="Hapus Activity"
          desc={`Apakah Anda yakin ingin menghapus activity "${selectedActivity.title}"?`}
          continueAction={handleDeleteConfirm}
        />
      )}

      <Wrapper className="flex flex-col">
        {/* Header Action*/}
        <section className="flex items-center justify-between gap-0 w-full mb-4">
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center gap-2">
              <Input
                className="w-100"
                placeholder="Cari judul atau deskripsi..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button onClick={handleSearchSubmit}>Cari</Button>
              {(searchInput || searchQuery) && (
                <Button variant="outline" onClick={handleClearSearch}>
                  Clear
                </Button>
              )}
            </div>
            <div>
              <SelectComponent
                label="Filter By"
                placeholder="Filter By"
                value={statusFilter}
                onChange={handleStatusFilter}
                options={filterStatusArr.map((s) => ({ label: s, value: s }))}
              />
            </div>
            <Button onClick={handleRefresh} disabled={isLoading}>
              <MdOutlineLoop className={isLoading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </Button>
          </div>
          <div>
            {/* Gunakan URL dengan query params */}
            <Link href={addActivityUrl}>
              <Button>
                <Plus /> Activity Baru
              </Button>
            </Link>
          </div>
        </section>

        {/* TableList */}
        <section className="flex-1 min-h-0">
          {isLoading ? (
            <TableSkeleton
              columns={activityColumns.length}
              rows={5}
              showActions={true}
            />
          ) : (
            <TableList
              columns={activityColumns}
              data={activities}
              onEdit={handleEdit}
              onDelete={(row) => {
                setSelectedActivity(row);
                setShowAlertDelete(true);
              }}
            />
          )}
        </section>

        {/* Pagination */}
        <section className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <SelectComponent
              label="Data Per Halaman"
              placeholder="Data Per Halaman"
              value={limit.toString()}
              onChange={handleLimitChange}
              options={pageLength.map((s) => ({ label: s, value: s }))}
            />
            <div className="text-sm text-gray-600">
              Menampilkan {activities.length} dari {total} data
              {searchQuery && ` untuk "${searchQuery}"`}
            </div>
          </div>
          <div className="text-white">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page - 1);
                    }}
                    className={
                      page <= 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNum);
                        }}
                        isActive={pageNum === page}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {totalPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page + 1);
                    }}
                    className={
                      page >= totalPages ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </section>
      </Wrapper>
    </>
  );
}