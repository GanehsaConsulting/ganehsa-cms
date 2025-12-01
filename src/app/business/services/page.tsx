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
import { useState } from "react";
import { IoLink } from "react-icons/io5";
import { toast } from "sonner";
import { DialogInput } from "@/components/dialog-input";
import { TableSkeleton } from "@/components/skeletons/table-list";
import { MdOutlineLoop } from "react-icons/md";
import { useServices } from "@/hooks/useServices";
import { Package } from "@prisma/client";

export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  packages?: Package[];
}

export interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

const serviceColumns: Column<Service>[] = [
  { key: "id", label: "ID", className: "font-medium w-[80px]" },
  { key: "name", label: "Name", className: "font-medium" },
  {
    key: "slug",
    label: "Slug",
    className: "italic",
    render: (row) => (
      <div className="flex items-center gap-2 bg-white/20 px-2 py-1 rounded-md w-fit">
        <IoLink className="text-blue-900" />
        <span className="font-medium">{row.slug}</span>
      </div>
    ),
  },
  {
    key: "description",
    label: "Description",
    className: "font-medium",
    render: (row) => (
      <span className="truncate max-w-[200px] block">
        {row.description || "-"}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Date created",
    className: "font-semibold",
    render: (row) => new Date(row.createdAt).toLocaleDateString("id-ID"),
  },
];

export const formServiceColumns: Column<Service>[] = [
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "description", label: "Description" },
];

export default function ServicesPage() {
  const pageLength = ["10", "20", "50"];
  const [editModal, setEditModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Service | null>(null);
  const {
    isLoading,
    pagination,
    token,
    fetchDataService,
    currentPage,
    setCurrentPage,
    limit,
    setLimit,
    setSearchQuery,
    dataServices,
  } = useServices();
  const [searchInput, setSearchInput] = useState("");

  // Handle search
  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  // Handle enter key di search
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle limit change
  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
    setCurrentPage(1);
  };

  // Generate page numbers
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(pagination.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  async function handleNewService(values: Partial<Service>) {
    try {
      console.log("Creating service with token:", token); // Debug

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business/services`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      console.log("Create response status:", res.status); // Debug

      if (res.status === 401) {
        throw new Error("Unauthorized - Please login again");
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to add service: ${res.status}`
        );
      }

      toast.success("Service berhasil ditambahkan!");
      fetchDataService();
      setCreateModal(false);
    } catch (err) {
      console.error("Create service error:", err);
      toast.error(err instanceof Error ? err.message : "Unknown error");
    }
  }

  async function handleUpdateService(values: Partial<Service>) {
    if (!selectedRow) return;

    try {
      console.log("Updating service with token:", token); // Debug

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/business/services/${selectedRow.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      console.log("Update response status:", res.status); // Debug

      if (res.status === 401) {
        throw new Error("Unauthorized - Please login again");
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to update service: ${res.status}`
        );
      }

      toast.success("Service berhasil diupdate!");
      fetchDataService();
      setEditModal(false);
    } catch (err) {
      console.error("Update service error:", err);
      toast.error(err instanceof Error ? err.message : "Unknown error");
    }
  }

  async function handleDeleteService(row: Service) {
    try {
      console.log("Deleting service with token:", token); // Debug

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/business/services/${row.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Delete response status:", res.status); // Debug

      if (res.status === 401) {
        throw new Error("Unauthorized - Please login again");
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to delete service: ${res.status}`
        );
      }

      toast.success("Service berhasil dihapus!");
      fetchDataService();
    } catch (err) {
      console.error("Delete service error:", err);
      toast.error(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <Wrapper className="flex flex-col">
      {/* Header Action */}
      <section className="flex items-center justify-between gap-0 w-full">
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-2">
            <Input
              className="w-100"
              placeholder="Cari service..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleSearchKeyPress}
            />
            <Button onClick={handleSearch}>Cari</Button>
            <Button onClick={fetchDataService} disabled={isLoading}>
              <MdOutlineLoop className={isLoading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
        <div>
          <Button onClick={() => setCreateModal(true)}>
            <Plus />
            Service Baru
          </Button>
        </div>
      </section>

      {/* TableList */}
      <section className="flex-1 min-h-0 mt-4">
        {isLoading ? (
          <TableSkeleton columns={5} rows={5} showActions={true} />
        ) : (
          <>
            <TableList
              columns={serviceColumns}
              data={dataServices}
              onEdit={(row) => {
                setSelectedRow(row);
                setEditModal(true);
              }}
              onDelete={handleDeleteService}
            />
            {dataServices.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                Tidak ada data service yang ditemukan
              </div>
            )}
          </>
        )}
      </section>

      {/* Pagination */}
      <section className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-4">
          <SelectComponent
            label="Data Per Halaman"
            placeholder={limit.toString()}
            options={pageLength.map((s) => ({
              label: `${s} per halaman`,
              value: s,
            }))}
            value={limit.toString()}
            onChange={handleLimitChange}
          />
          <span className="text-white text-sm">
            Menampilkan {(currentPage - 1) * limit + 1} -{" "}
            {Math.min(currentPage * limit, pagination.totalCount)} dari{" "}
            {pagination.totalCount} data
          </span>
        </div>
        <div className="text-white">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {generatePageNumbers().map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => handlePageChange(pageNum)}
                    isActive={currentPage === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {pagination.totalPages > 5 &&
                currentPage < pagination.totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={
                    currentPage === pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>

      {/* Edit Modal */}
      {editModal && selectedRow && (
        <DialogInput<Service>
          title={`Edit service: ${selectedRow.name}`}
          desc="Ini akan merubah informasi service saat ini"
          open={editModal}
          onOpenChange={setEditModal}
          columns={formServiceColumns}
          rowData={selectedRow}
          onSubmit={handleUpdateService}
        />
      )}

      {/* Add Modal */}
      {createModal && (
        <DialogInput<Service>
          title={`Tambah Service`}
          desc="Tambahkan service baru ke dalam list"
          open={createModal}
          onOpenChange={setCreateModal}
          columns={formServiceColumns}
          rowData={null}
          onSubmit={handleNewService}
        />
      )}
    </Wrapper>
  );
}
