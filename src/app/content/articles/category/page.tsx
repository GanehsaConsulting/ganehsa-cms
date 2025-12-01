// buatkan seperti page ini :

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
import { useCategory } from "@/hooks/useCategory";

export interface Category {
  id: number;
  name: string;
  articleCount: number;
  slug: string;
  date: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

const categoryColumns: Column<Category>[] = [
  { key: "id", label: "ID", className: "font-medium w-[80]" },
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
    key: "articleCount",
    label: "Articles Count",
    className: "font-bold w-[190px]",
  },
  { key: "date", label: "Date created", className: "font-semibold" },
];

export const formCategoryColumns: Column<Category>[] = [
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
];

export default function ArticleCategoryPage() {
  const pageLength = ["10", "20", "50"];
  const [editModal, setEditModal] = useState(false);
  const [newArtikelModal, setNewArtikelModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Category | null>(null);
  const {
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
  } = useCategory();
  const [searchInput, setSearchInput] = useState("");

  // Handle search
  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1); // Reset ke halaman pertama saat search
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
    setCurrentPage(1); // Reset ke halaman pertama saat ganti limit
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

  async function handleNewCategory(values: Partial<Category>) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/content/articles/category`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!res.ok) throw new Error("Failed to add category");

      toast.success("Kategori berhasil ditambahkan!");
      fetchDataCategory();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "unknown errors");
    }
  }

  async function handleUpdateCategory(values: Partial<Category>) {
    if (!selectedRow) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/content/articles/category/${selectedRow.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!res.ok) throw new Error("Failed to update category");

      toast.success("Kategori berhasil diupdate!");
      fetchDataCategory();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "unknown errors");
    }
  }

  async function handleDeleteCategory(row: Category) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/content/articles/category/${row.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete category");

      toast.success("Kategori berhasil dihapus!");
      fetchDataCategory();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "unknown errors");
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
              placeholder="Cari kategori..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleSearchKeyPress}
            />
            <Button onClick={handleSearch}>Cari</Button>
             <Button onClick={fetchDataCategory} disabled={isLoading}>
              <MdOutlineLoop className={isLoading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
        <div>
          <Button onClick={() => setNewArtikelModal(true)}>
            <Plus />
            Kategori Baru
          </Button>
        </div>
      </section>

      {/* TableList */}
      <section className="flex-1 min-h-0">
        {isLoading ? (
          <TableSkeleton columns={4} rows={4} showActions={true} />
        ) : (
          <>
            <TableList
              columns={categoryColumns}
              data={dataCategories}
              onEdit={(row) => {
                setSelectedRow(row);
                setEditModal(true);
              }}
              onDelete={handleDeleteCategory}
            />
            {dataCategories.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                Tidak ada data kategori yang ditemukan
              </div>
            )}
          </>
        )}
      </section>

      {/* Pagination */}
      <section className="flex items-center justify-between">
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
        <DialogInput<Category>
          title={`Edit kategori: ${selectedRow.name}`}
          desc="Ini akan merubah informasi kategori saat ini"
          open={editModal}
          onOpenChange={setEditModal}
          columns={formCategoryColumns}
          rowData={selectedRow}
          onSubmit={handleUpdateCategory}
        />
      )}

      {/* Add Modal */}
      {newArtikelModal && (
        <DialogInput<Category>
          title={`Tambah Kategori`}
          desc="Tambahkan kategori baru ke dalam list"
          open={newArtikelModal}
          onOpenChange={setNewArtikelModal}
          columns={formCategoryColumns}
          rowData={null}
          onSubmit={handleNewCategory}
        />
      )}
    </Wrapper>
  );
}
