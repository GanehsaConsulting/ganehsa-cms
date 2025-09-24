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
import { DialogComponent } from "@/components/ui/dialog";
import clsx from "clsx";

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
  { key: "id", label: "No", className: "font-medium w-[80]" },
  { key: "name", label: "Name", className: "font-medium " },
  { key: "slug", label: "Slug", className: "italic font-semibold " },
  { key: "date", label: "Date created", className: "font-semibold" },
 
  {
    key: "articleCount",
    label: "Articles Count",
    className: "font-bold w-[190px]",
  },
];

// Data contoh
const categoryData: Category[] = [
  {
    id: 1,
    name: "Pajak",
    slug: "/konsultan-pajak",
    articleCount: 15,
    date: "19-06-2025",
  },
  {
    id: 2,
    name: "Pajak",
    slug: "/konsultan-pajak",
    articleCount: 15,
    date: "19-06-2025",
  },
  {
    id: 2,
    name: "Pajak",
    slug: "/konsultan-pajak",
    articleCount: 15,
    date: "19-06-2025",
  },
  {
    id: 2,
    name: "Pajak",
    slug: "/konsultan-pajak",
    articleCount: 15,
    date: "19-06-2025",
  },
];

export default function ArticleCategoryPage() {
  const statusArr = ["All", "Draft", "Archive", "Publish"];
  const pageLength = ["10", "20", "100"];

  const [editModal, setEditModal] = useState(false);
  const [newArtikelModal, setNewArtikelModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Category | null>(null);

  function handleEdit(row: Category) {
    setSelectedRow(row);
    setEditModal(true);
  }

  return (
    <Wrapper className="flex flex-col h-full">
      {/* Header Action*/}
      <section className="flex items-center justify-between gap-0 w-full">
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-2">
            <Input className="w-full" placeholder="Cari kategori..." />
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
        <TableList
          columns={categoryColumns}
          data={categoryData}
          onEdit={handleEdit}
          onDelete={(row) => console.log("Delete:", row)}
        />
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

      {/* modal */}
      {editModal && selectedRow && (
        <DialogComponent
          title={`Edit kategori: ${selectedRow.name}`}
          desc="Ini akan merubah informasi kategori saat ini"
          open={editModal}
          onOpenChange={setEditModal}
          columns={categoryColumns}
          rowData={selectedRow}
        />
      )}

      {editModal && selectedRow && (
        <DialogComponent
          title={`Edit kategori: ${selectedRow.name}`}
          desc="Ini akan merubah informasi kategori saat ini"
          open={editModal}
          onOpenChange={setEditModal}
          columns={categoryColumns}
          rowData={selectedRow}
          onSubmit={(values) => {
            console.log("Edit result:", values); // ✅ hasil edit
          }}
        />
      )}

      {newArtikelModal && (
        <DialogComponent
          title={`Tambah Kategori`}
          desc="Tambahkan kategori baru ke dalam list"
          open={newArtikelModal}
          onOpenChange={setNewArtikelModal}
          columns={categoryColumns}
          rowData={null} // ✅ kosong → mode tambah
          onSubmit={(values) => {
            console.log("New category:", values); // ✅ hasil tambah
          }}
        />
      )}
    </Wrapper>
  );
}
