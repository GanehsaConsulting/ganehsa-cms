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
import { useState } from "react";
import Link from "next/link";
import { TableSkeleton } from "@/components/skeletons/table-list";
import { MdOutlineLoop } from "react-icons/md";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { getToken } from "@/lib/helpers";
import { usePackages } from "@/hooks/usePackages";
import { IoLink } from "react-icons/io5";
import { useServices } from "@/hooks/useServices";

export interface TablePackages {
  id: number;
  type: string;
  service: string;
  price: number;
  discount: number;
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
    className: "font-semibold min-w-[200px]",
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
    className: "min-w-[130px]",
    render: (row) => (
      <div className="flex items-center gap-1" >
        <span className="font-semibold">Rp</span>
        <span className="font-medium" >{row.price.toLocaleString()}</span>
      </div>
    ),
  },
  {
    key: "priceOriginal",
    label: "Original Price",
    className: "min-w-[170px]",   
    render: (row) => (
      <div className="flex items-center gap-2">
        <span className="italic text-red-900 " >{`Rp ${row.priceOriginal.toLocaleString()}`}</span>
        <div className="bg-red-600/30 text-white p-1 rounded-md text-xs">{`${row?.discount}%`}</div>
      </div>
    ),
  },
  {
    key: "link",
    label: "Link",
    className: "min-w-[210px] truncate",
    render: (row) => (
      <a
        href={row.link}
        className="flex items-center gap-2 bg-white/20 px-2 py-1 rounded-md w-fit"
      >
        <IoLink className="text-blue-900" />
        <span className="font-medium">
          {row.link && row.link.slice(0, 18) + "..."}
        </span>
      </a>
    ),
  },
  {
    key: "highlight",
    label: "highlight",
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
    className: "max-w-[250px] flex-wrap",
    render: (row) => (
      <div className="flex flex-wrap gap-1">
        {row.features.slice(0, 2).map((feature, index) => (
          <span
            key={index}
            className={clsx(
              "text-xs px-2 py-1 rounded-full border font-semibold",
              feature.status
                ? "bg-green-100/40 text-green-800 border-green-300"
                : "bg-red-100/40 text-red-800 border-red-300"
            )}
          >
            {feature.feature.slice(0, 35) + "..."}
          </span>
        ))}
        {row.features.length > 2 && (
          <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
            +{row.features.length - 2}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "requirements",
    label: "Requirements",
    className: "min-w-[170px]",
    render: (row) => (
      <div className="flex flex-wrap gap-1">
        {row.requirements.slice(0, 2).map((requirement, index) => (
          <span
            key={index}
            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full border border-blue-300"
          >
            {requirement.slice(0, 20) + "..."}
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

  // usePackages hook dengan semua state management
  const {
    setSearchQuery,
    setPage,
    page,
    limit,
    setLimit,
    searchQuery,
    serviceFilter,
    setServiceFilter,
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
    window.location.reload()
  };

  const { dataServices, isLoading: servicesLoading } = useServices();

  const handleServiceFilter = (value: string) => {
    setServiceFilter(value);
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
      const apiUrl = `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/packages/${selectedPackage.id}`;
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

        // Set page ke 1 dan refresh data
        setPage(1);
        window.location.reload
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
        {/* Header Action */}
        <section className="flex items-center justify-between gap-0 w-full mb-4">
          <div className="flex items-center gap-4 w-full">
            {/* Search Input */}
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

            {/* Filter by Service */}
            <div>
              <SelectComponent
                label="Filter By Service"
                placeholder={servicesLoading ? "Loading..." : "All Services"}
                value={serviceFilter}
                onChange={handleServiceFilter}
                options={[
                  { label: "All Services", value: "All" },
                  ...dataServices.map((service) => ({
                    label: service.name,
                    value: service.slug,
                  })),
                ]}
                disabled={servicesLoading}
              />
            </div>

            {/* Refresh Button */}
            <Button onClick={handleRefresh} disabled={isLoading}>
              <MdOutlineLoop className={isLoading ? "animate-spin" : ""} />
            </Button>
          </div>

          {/* Add New Package Button */}
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
              options={pageLength.map((s: string) => ({ label: s, value: s }))}
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