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

// Tipe data untuk kategori
interface Category {
  id: number;
  name: string;
  articleCount: number;
  slug: string;
  date: string;
 }

// Styles untuk status
const statusStyles = {
  draft: "text-yellow-900 dark:text-white/80 border border-yellow-900 bg-yellow-400/20",
  archive: "text-blue-900 dark:text-white/80 border border-blue-900 bg-blue-400/20",
  publish: "text-green-900 dark:text-white/80 border border-green-900 bg-green-400/20",
};

// Definisikan columns untuk kategori
const categoryColumns: Column<Category>[] = [
  { key: "name", label: "Name", className: "font-medium clamp-1" },
  { key: "slug", label: "slug", className: "italic font-semibold" },
  { key: "articleCount", label: "Articles Count", className: "font-bold " },
  { key: "date", label: "date created", className: " font-semibold" },
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
    id: 1,
    name: "Pajak",
    slug: "/konsultan-pajak",
    articleCount: 15,
    date: "19-06-2025",
  },
  {
    id: 1,
    name: "Pajak",
    slug: "/konsultan-pajak",
    articleCount: 15,
    date: "19-06-2025",
  },
  {
    id: 1,
    name: "Pajak",
    slug: "/konsultan-pajak",
    articleCount: 15,
    date: "19-06-2025",
  },
  {
    id: 1,
    name: "Pajak",
    slug: "/konsultan-pajak",
    articleCount: 15,
    date: "19-06-2025",
  },
  {
    id: 1,
    name: "Pajak",
    slug: "/konsultan-pajak",
    articleCount: 15,
    date: "19-06-2025",
  },
  {
    id: 1,
    name: "Pajak",
    slug: "/konsultan-pajak",
    articleCount: 15,
    date: "19-06-2025",
  },
  
];

export default function ArticleCategoryPage() {
  const statusArr = ["All", "Draft", "Archive", "Publish"];
  const pageLength = ["10", "20", "100"];

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
          <Button>
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