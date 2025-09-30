// article page - updated with data passing
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
import { ActionsDialog } from "@/components/actions-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Tipe data untuk artikel
interface Article {
  id: number;
  title: string;
  category: string;
  content: string;
  date: string;
  status: "draft" | "archive" | "publish";
  highlight?: boolean;
}

// Styles untuk status
const statusStyles = {
  draft: "text-yellow-700 dark:text-white/80  -yellow-700 bg-yellow-200/20",
  archive: "text-blue-700 dark:text-white/80  -blue-700 bg-blue-200/20",
  publish: "text-green-700 dark:text-white/80  -green-700 bg-green-200/20",
};

// Definisikan columns untuk artikel
const articleColumns: Column<Article>[] = [
  { key: "id", label: "No", className: "font-semibold w-[30]" },
  { key: "title", label: "Title", className: "font-semibold " },
  { key: "category", label: "Category", className: "" },
  { key: "content", label: "Content", className: "" },
  {
    key: "status",
    label: "Status",
    className: "",
    render: (row) => (
      <div
        className={clsx(
          "inline-flex items-center rounded-full gap-2 px-3 font-semibold py-1",
          statusStyles[row.status]
        )}
      >
        <span>{row.status}</span>
      </div>
    ),
  },
  {
    key: "date",
    label: "Tanggal Upload",
    className: " ",
  },
  {
    key: "highlight",
    label: "Highlight",
    className: "",
    render: (row) => (
      <div className="flex items-center gap-2 bg-lightColor/20 px-2 py-1 rounded-md w-fit">
        <span
          className={clsx(
            "h-2 w-2 rounded-full",
            row.highlight ? "bg-green-600" : "bg-red-700"
          )}
        />
        <span className="font-medium " >
          {row.highlight ? "Active" : "Inactive"}
        </span>
      </div>
    ),
  },
];

// Data contoh - updated dengan id yang berbeda
const articleData: Article[] = [
  {
    id: 1,
    title: "Panduan Lengkap Pajak Penghasilan untuk UKM",
    category: "Pajak",
    content:
      "Artikel ini membahas secara lengkap tentang pajak penghasilan yang harus dibayar oleh usaha kecil dan menengah...",
    date: "09-09-2025",
    status: "draft",
    highlight: true,
  },
  {
    id: 2,
    title: "Cara Optimasi Website untuk SEO",
    category: "Website",
    content:
      "Tips dan trik untuk mengoptimalkan website agar mudah ditemukan di mesin pencari...",
    date: "08-09-2025",
    status: "archive",
  },
  {
    id: 3,
    title: "Langkah-langkah Pendirian PT di Indonesia",
    category: "Pendirian PT",
    content:
      "Panduan step by step untuk mendirikan Perseroan Terbatas di Indonesia...",
    date: "07-09-2025",
    status: "publish",
  },
  {
    id: 4,
    title: "Memahami Hak Kekayaan Intelektual",
    category: "HAKI",
    content:
      "Penjelasan lengkap tentang berbagai jenis hak kekayaan intelektual dan cara melindunginya...",
    date: "06-09-2025",
    status: "publish",
    highlight: true,
  },
  {
    id: 5,
    title: "Update Regulasi Pajak Terbaru 2025",
    category: "Pajak",
    content:
      "Informasi terkini tentang perubahan regulasi pajak yang berlaku di tahun 2025...",
    date: "05-09-2025",
    status: "draft",
    highlight: true,
  },
  {
    id: 6,
    title: "Update Regulasi Pajak Terbaru 2025",
    category: "Pajak",
    content:
      "Informasi terkini tentang perubahan regulasi pajak yang berlaku di tahun 2025...",
    date: "05-09-2025",
    status: "draft",
  },
  {
    id: 7,
    title: "Update Regulasi Pajak Terbaru 2025",
    category: "Pajak",
    content:
      "Informasi terkini tentang perubahan regulasi pajak yang berlaku di tahun 2025...",
    date: "05-09-2025",
    status: "draft",
  },
  // {
  //   id: 8,
  //   title: "Update Regulasi Pajak Terbaru 2025",
  //   category: "Pajak",
  //   content:
  //     "Informasi terkini tentang perubahan regulasi pajak yang berlaku di tahun 2025...",
  //   date: "05-09-2025",
  //   status: "draft",
  // },
  // {
  //   id: 9,
  //   title: "Update Regulasi Pajak Terbaru 2025",
  //   category: "Pajak",
  //   content:
  //     "Informasi terkini tentang perubahan regulasi pajak yang berlaku di tahun 2025...",
  //   date: "05-09-2025",
  //   status: "draft",
  // },
  // {
  //   id: 10,
  //   title: "Update Regulasi Pajak Terbaru 2025",
  //   category: "Pajak",
  //   content:
  //     "Informasi terkini tentang perubahan regulasi pajak yang berlaku di tahun 2025...",
  //   date: "05-09-2025",
  //   status: "draft",
  // },
  // {
  //   id: 11,
  //   title: "Update Regulasi Pajak Terbaru 2025",
  //   category: "Pajak",
  //   content:
  //     "Informasi terkini tentang perubahan regulasi pajak yang berlaku di tahun 2025...",
  //   date: "05-09-2025",
  //   status: "draft",
  // },
];

export default function ArticlePage() {
  const statusArr = ["All", "Draft", "Archive", "Publish"];
  const pageLength = ["10", "20", "100"];
  const router = useRouter();

  // Fungsi untuk handle edit dengan passing data
  const handleEdit = (row: Article) => {
    // Method 1: Using localStorage (temporary storage)
    localStorage.setItem(
      "editArticleData",
      JSON.stringify({
        id: row.id,
        judul: row.title,
        kategori: row.category,
        konten: row.content,
        status: row.status,
        date: row.date,
      })
    );

    router.push(`/article/${row.id}/edit`);

    // Method 2: Using URL params (alternative approach)
    // const params = new URLSearchParams({
    //   judul: row.title,
    //   kategori: row.category,
    //   konten: row.content,
    //   status: row.status
    // });
    // router.push(`/article/${row.id}/edit?${params.toString()}`);
  };

  return (
    <Wrapper className="flex flex-col">
      {/* Header Action*/}
      <section className="flex items-center justify-between gap-0 w-full">
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-2">
            <Input className="w-100" placeholder="Cari judul..." />
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
          <Link href="/article/new">
            <Button>
              <Plus /> Artikel Baru
            </Button>
          </Link>
        </div>
      </section>

      {/* TableList */}
      <section className="flex-1 min-h-0">
        <TableList
          columns={articleColumns}
          data={articleData}
          onEdit={handleEdit} // ⬅️ Updated: menggunakan handleEdit function
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
    </Wrapper>
  );
}
