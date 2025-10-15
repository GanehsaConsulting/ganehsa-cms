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
import { useEffect, useState } from "react";
import Link from "next/link";
import { TableSkeleton } from "@/components/skeletons/table-list";
import { MdOutlineLoop } from "react-icons/md";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { getToken } from "@/lib/helpers";
import { usePackages } from "@/hooks/usePackages";

export interface TablePackages {
  id: number;
  type: string;
  price: number;
  priceOriginal: number;
  link: string;
  highlight: boolean;
  features: Array<{
    feature: string;
    status: boolean;
  }>;
  requirements: string[];
  createdAt: string;
}

const packageColumns: Column<TablePackages>[] = [
  { key: "id", label: "ID", className: "font-semibold w-[30]" },
  {
    key: "type",
    label: "Type",
    className: "font-semibold min-w-[230px]",
    render: (row) => (
      <div className="flex items-center gap-2">
        <span>{row.type}</span>
        {row.highlight && (
          <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
            Highlight
          </span>
        )}
      </div>
    ),
  },
  {
    key: "price",
    label: "Price",
    className: "min-w-[120px]",
    render: (row) => `Rp ${row.price.toLocaleString()}`,
  },
  {
    key: "priceOriginal",
    label: "Original Price",
    className: "min-w-[120px]",
    render: (row) => `Rp ${row.priceOriginal.toLocaleString()}`,
  },
  {
    key: "link",
    label: "Link",
    className: "min-w-[150px] truncate",
    render: (row) => (
      <a
        href={row.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline truncate block max-w-[150px]"
      >
        {row.link}
      </a>
    ),
  },
  {
    key: "highlight",
    label: "Status",
    className: "w-[130px]",
    render: (row) => (
      <div className="flex items-center gap-2 bg-lightColor/20 px-2 py-1 rounded-md w-fit">
        <span
          className={clsx(
            "h-2 w-2 rounded-full",
            row.highlight ? "bg-green-600" : "bg-red-700"
          )}
        />
        <span className="font-medium">
          {row.highlight ? "Active" : "Inactive"}
        </span>
      </div>
    ),
  },
  {
    key: "features",
    label: "Features",
    className: "min-w-[200px]",
    render: (row) => (
      <div className="flex flex-wrap gap-1">
        {row.features.slice(0, 3).map((feature, index) => (
          <span
            key={index}
            className={clsx(
              "text-xs px-2 py-1 rounded-full border",
              feature.status
                ? "bg-green-100 text-green-800 border-green-300"
                : "bg-red-100 text-red-800 border-red-300"
            )}
          >
            {feature.feature}
          </span>
        ))}
        {row.features.length > 3 && (
          <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
            +{row.features.length - 3}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "requirements",
    label: "Requirements",
    className: "min-w-[150px]",
    render: (row) => (
      <div className="flex flex-wrap gap-1">
        {row.requirements.slice(0, 2).map((requirement, index) => (
          <span
            key={index}
            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full border border-blue-300"
          >
            {requirement}
          </span>
        ))}
        {row.requirements.length > 2 && (
          <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
            +{row.requirements.length - 2}
          </span>
        )}
      </div>
    ),
  },
];

export default function PriceList() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const {
    token,
    setSearchQuery,
    setPage,
    fetchPackages,
    page,
    limit,
    setLimit,
    searchQuery,
    highlightArr,
    highlightFilter,
    setHighlightFilter,
    typeArr,
    typeFilter,
    setTypeFilter,
    total,
    totalPages,
    pageLength,
    isLoading,
    packages,
  } = usePackages();

  // Alert dialog state
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TablePackages | null>(
    null
  );

  // Tambahkan di hooks/usePackages.ts untuk debugging
  const testApiConnection = async () => {
    try {
      const testUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/package?page=1&limit=5`;
      console.log("🧪 Testing API connection:", testUrl);

      const response = await fetch(testUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("🧪 API Response status:", response.status);
      const data = await response.json();
      console.log("🧪 API Response data:", data);

      return data;
    } catch (error) {
      console.error("🧪 API Connection test failed:", error);
      return null;
    }
  };

  // Panggil di useEffect untuk debugging
  useEffect(() => {
    const initToken = getToken();
    if (initToken) {
      // setToken(initToken);
      // Untuk debugging, test koneksi sekali saat load
      if (process.env.NODE_ENV === "development") {
        testApiConnection();
      }
    }
  }, []);

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleRefresh = () => {
    if (token) {
      fetchPackages(
        token,
        page,
        limit,
        searchQuery,
        typeFilter,
        highlightFilter
      );
    }
  };

  const handleHighlightFilter = (value: string) => {
    setHighlightFilter(value);
    setPage(1);
  };

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value);
    setPage(1);
  };

  const handleLimitChange = (value: string) => {
    setLimit(parseInt(value));
    setPage(1);
  };

  const handleEdit = (row: TablePackages) => {
    router.push(`/business/packages/${row.id}/edit`);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPackage) return;

    const token = getToken();
    if (!token) {
      toast.error("Token tidak ditemukan");
      return;
    }

    try {
      // PERBAIKAN: Gunakan /api/package (singular) bukan /api/packages (plural)
      const apiUrl = `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/package/${selectedPackage.id}`;
      console.log("🗑️ Deleting package from:", apiUrl);

      const res = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${errorText}`
        );
      }

      const data = await res.json();

      if (data.success) {
        toast.success(`Package "${selectedPackage.type}" berhasil dihapus!`);

        // Refresh the packages list
        const newToken = getToken();
        if (newToken) {
          await fetchPackages(
            newToken,
            1,
            limit,
            searchQuery,
            typeFilter,
            highlightFilter
          );
        }
      } else {
        toast.error(data.message || "Gagal menghapus package");
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      toast.error(errMsg);
      console.error("Delete package error:", err);
    } finally {
      setShowAlertDelete(false);
      setSelectedPackage(null);
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

  return (
    <>
      {/* Alert Dialog for Delete Confirmation */}
      {showAlertDelete && selectedPackage && (
        <AlertDialogComponent
          open={showAlertDelete}
          onOpenChange={(open) => {
            setShowAlertDelete(open);
            if (!open) {
              setSelectedPackage(null);
            }
          }}
          header="Hapus Package"
          desc={`Apakah Anda yakin ingin menghapus package "${selectedPackage.type}"?`}
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
                placeholder="Cari type package..."
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
                label="Filter By Type"
                placeholder="Filter By Type"
                value={typeFilter}
                onChange={handleTypeFilter}
                options={typeArr.map((type: any) => ({
                  label: type,
                  value: type,
                }))}
              />
            </div>
            {/* <div>
              <SelectComponent
                label="Filter By Status"
                placeholder="Filter By Status"
                value={highlightFilter}
                onChange={handleHighlightFilter}
                options={highlightArr.map((status: any) => ({ label: status, value: status }))}
              />
            </div> */}
            <Button onClick={handleRefresh} disabled={isLoading}>
              <MdOutlineLoop className={isLoading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </Button>
          </div>
          <div>
            <Link href="/business/packages/new">
              <Button>
                <Plus /> Package Baru
              </Button>
            </Link>
          </div>
        </section>

        {/* TableList */}
        <section className="flex-1 min-h-0">
          {isLoading ? (
            <TableSkeleton
              columns={packageColumns.length}
              rows={5}
              showActions={true}
            />
          ) : (
            <TableList
              columns={packageColumns}
              data={packages}
              onEdit={handleEdit}
              onDelete={(row) => {
                setSelectedPackage(row);
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
              options={pageLength.map((s: any) => ({ label: s, value: s }))}
            />
            <div className="text-sm text-gray-600">
              Menampilkan {packages.length} dari {total} data
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
