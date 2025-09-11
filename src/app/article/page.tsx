"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wrapper } from "@/components/wrapper";
import {
  Select,
  SelectComponent,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Table } from "@/components/ui/table";
import { TableList } from "@/components/table-list";
import clsx from "clsx";

type Status = "draft" | "archive" | "publish";

// 2. Definisikan struktur data row
interface TableRowData {
  id: number;
  title: string;
  category: string;
  content: string;
  date: string;
  status: Status;
}

// 3. Styles untuk status
const statusStyles: Record<Status, string> = {
  draft:
    "text-yellow-900 dark:text-white/80 border border-yellow-900 bg-yellow-400/20",
  archive:
    "text-blue-900 dark:text-white/80 border border-blue-900 bg-blue-400/20",
  publish:
    "text-green-900 dark:text-white/80 border border-green-900 bg-green-400/20",
};

// 4. Definisikan tipe column
interface Column<T> {
  key: keyof T;
  label: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

// 5. Definisikan columns
const columns: Column<TableRowData>[] = [
  { key: "title", label: "Title", className: "font-medium clamp-1" },
  { key: "category", label: "Category", className: "font-bold" },
  { key: "content", label: "Content", className: "clamp-1" },
  {
    key: "status",
    label: "Status",
    render: (row) => (
       <div
    className={clsx(
      "inline-flex items-center rounded-full w-fit gap-2 px-3 font-semibold py-1",
      statusStyles[row.status]
    )}
  >
    <span>{row.status}</span>
  </div>
    ),
  },
  { key: "date", label: "Tanggal Upload", className: "italic font-semibold" },
];

export const dataTable: TableRowData[] = [
  {
    id: 1,
    title: "vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    category: "Pajak",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "09-09-2025",
    status: "archive",
  },
  {
    id: 1,
    title: "vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    category: "Pajak",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "09-09-2025",
    status: "draft",
  },
  {
    id: 1,
    title: "vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    category: "Pajak",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "09-09-2025",
    status: "draft",
  },
  {
    id: 1,
    title: "vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    category: "Pajak",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "09-09-2025",
    status: "draft",
  },
  {
    id: 1,
    title: "vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    category: "Pajak",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "09-09-2025",
    status: "draft",
  },
  {
    id: 1,
    title: "vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    category: "Pajak",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "09-09-2025",
    status: "draft",
  },
  {
    id: 1,
    title: "vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    category: "Pajak",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "09-09-2025",
    status: "draft",
  },
  {
    id: 1,
    title: "vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    category: "Pajak",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "09-09-2025",
    status: "draft",
  },
  {
    id: 2,
    title: "Example Article 2",
    category: "Hukum",
    content: "Contoh isi artikel kedua.",
    date: "10-09-2025",
    status: "publish",
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
          columns={columns}
          data={dataTable}
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
