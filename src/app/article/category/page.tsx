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
import { useEffect, useState } from "react";
import { IoLink } from "react-icons/io5";
import { toast } from "sonner";
import { DialogInput } from "@/components/dialog-input";
import { TableSkeleton } from "@/components/skeletons/table-list";

// Tipe data untuk kategori
interface Category {
  id: number;
  name: string;
  articleCount: number;
  slug: string;
  date: string;
}

// Definisikan columns untuk kategori
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
  const statusArr = ["All", "Draft", "Archive", "Publish"];
  const pageLength = ["10", "20", "100"];

  const [editModal, setEditModal] = useState(false);
  const [newArtikelModal, setNewArtikelModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Category | null>(null);
  const [dataCategories, setDataCategories] = useState<Category[]>([]);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [isLoading, setIsLoading] = useState(false);

  // 📌 Fetch kategori dari API
  async function fetchDataCategory() {
    if (!token) return;
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/article/category`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data) setDataCategories(data.data);
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
  }, []);

  // ➕ Tambah kategori
  async function handleNewCategory(values: Partial<Category>) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/article/category`,
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

  // ✏️ Edit kategori
  async function handleUpdateCategory(values: Partial<Category>) {
    if (!selectedRow) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/article/category/${selectedRow.id}`,
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

  // 🗑️ Hapus kategori
  async function handleDeleteCategory(row: Category) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/article/category/${row.id}`,
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
            <Input className="w-100" placeholder="Cari kategori..." />
            <Button>Cari</Button>
          </div>
          <div>
            <SelectComponent
              label="Filter By status"
              placeholder="Filter By status"
              options={statusArr.map((s) => ({ label: s, value: s }))}
            />
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
          <TableList
            columns={categoryColumns}
            data={dataCategories}
            onEdit={(row) => {
              setSelectedRow(row);
              setEditModal(true);
            }}
            onDelete={handleDeleteCategory} // 🔥 integrasi delete
          />
        )}
      </section>

      {/* Pagination */}
      <section className="flex items-center justify-between">
        <SelectComponent
          label="Data Per Halaman"
          placeholder="Data Per Halaman"
          options={pageLength.map((s) => ({ label: s, value: s }))}
        />
        <div className="text-white">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>

      {/* Edit Modal */}
      {editModal && selectedRow && (
        <DialogInput
          title={`Edit kategori: ${selectedRow.name}`}
          desc="Ini akan merubah informasi kategori saat ini"
          open={editModal}
          onOpenChange={setEditModal}
          columns={formCategoryColumns} // ✅ pakai form column
          rowData={selectedRow}
          onSubmit={handleUpdateCategory}
        />
      )}

      {/* Add Modal */}
      {newArtikelModal && (
        <DialogInput
          title={`Tambah Kategori`}
          desc="Tambahkan kategori baru ke dalam list"
          open={newArtikelModal}
          onOpenChange={setNewArtikelModal}
          columns={formCategoryColumns} // ✅ pakai form column
          rowData={null}
          onSubmit={handleNewCategory}
        />
      )}
    </Wrapper>
  );
}
