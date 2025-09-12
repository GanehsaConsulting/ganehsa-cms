"use client"

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

// Tipe data untuk artikel
interface Article {
  id: number;
  title: string;
  category: string;
  content: string;
  date: string;
  status: "draft" | "archive" | "publish";
}

// Styles untuk status
const statusStyles = {
  draft: "text-yellow-900 dark:text-white/80 border border-yellow-900 bg-yellow-400/20",
  archive: "text-blue-900 dark:text-white/80 border border-blue-900 bg-blue-400/20",
  publish: "text-green-900 dark:text-white/80 border border-green-900 bg-green-400/20",
};

// Definisikan columns untuk artikel
const articleColumns: Column<Article>[] = [
  { key: "title", label: "Title", className: "font-medium w-[210px]" },
  { key: "category", label: "Category", className: "font-bold w-[100px]" },
  { key: "content", label: "Content", className: "w-[220px]" },
  {
    key: "status",
    label: "Status",
    className: "w-[130px]",
    render: (row) => (
      <div className={clsx(
        "inline-flex items-center rounded-full gap-2 px-3 font-semibold py-1",
        statusStyles[row.status]
      )}>
        <span>{row.status}</span>
      </div>
    ),
  },
  { key: "date", label: "Tanggal Upload", className: "italic font-semibold w-[160px]" },
];

// Data contoh
const articleData: Article[] = [
  {
    id: 1,
    title: "Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    category: "Pajak",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    date: "09-09-2025",
    status: "draft",
  },
  {
    id: 1,
    title: "Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    category: "Pajak",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    date: "09-09-2025",
    status: "archive",
  },
  {
    id: 1,
    title: "Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    category: "Pajak",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    date: "09-09-2025",
    status: "archive",
  },
  {
    id: 1,
    title: "Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    category: "Pajak",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    date: "09-09-2025",
    status: "archive",
  },
  {
    id: 1,
    title: "Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    category: "Pajak",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    date: "09-09-2025",
    status: "archive",
  },
  {
    id: 1,
    title: "Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    category: "Website",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    date: "09-09-2025",
    status: "archive",
  },
  {
    id: 1,
    title: "Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    category: "Pajak",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    date: "09-09-2025",
    status: "archive",
  },
  {
    id: 1,
    title: "Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    category: "Pendirian PT",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    date: "09-09-2025",
    status: "archive",
  },
  {
    id: 1,
    title: "Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    category: "Pajak",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    date: "09-09-2025",
    status: "archive",
  },
  {
    id: 1,
    title: "Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    category: "Pajak",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    date: "09-09-2025",
    status: "archive",
  },
  {
    id: 1,
    title: "Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    category: "Pajak",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    date: "09-09-2025",
    status: "archive",
  },
];

export default function ArticlePage() {
  const statusArr = ["All", "Draft", "Archive", "Publish"];
  const pageLength = ["10", "20", "100"];

  return (
    <Wrapper className="flex flex-col h-full">
      {/* Header Action*/}
      <section className="flex items-center justify-between gap-0 w-full">
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-2">
            <Input className="w-full" placeholder="Cari judul..." />
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
          <Button>
            <Plus />
            Artikel Baru
          </Button>
        </div>
      </section>

      {/* TableList */}
      <section className="flex-1 min-h-0">
        <TableList
          columns={articleColumns}
          data={articleData}
          onEdit={(row) => console.log("Edit:", row)}
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