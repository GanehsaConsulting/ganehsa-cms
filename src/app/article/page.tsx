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
import { Plus, Search } from "lucide-react";
import { TableList, Column } from "@/components/table-list";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/skeletons/table-list";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { IoSearch } from "react-icons/io5";
import { MdOutlineLoop } from "react-icons/md";
import { getToken } from "@/lib/helpers";
import { useArticles } from "@/hooks/useArticles";

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status: "DRAFT" | "PUBLISH" | "ARCHIVE";
  highlight: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  author: {
    id: number;
    name: string;
    email: string;
  };
  thumbnail?: {
    id: number;
    url: string;
    title: string;
    alt: string;
  };
}

export interface TableArticle {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  category: string;
  content: string;
  date: string;
  status: "draft" | "archive" | "publish";
  highlight: boolean;
  originalId: number;
}

const statusStyles = {
  draft: "text-yellow-700 dark:text-white/80 bg-yellow-200/20",
  archive: "text-blue-700 dark:text-white/80 bg-blue-200/20",
  publish: "text-green-700 dark:text-white/80 bg-green-200/20",
};

const articleColumns: Column<TableArticle>[] = [
  { key: "id", label: "ID", className: "font-semibold w-[40px]" },
  { key: "title", label: "Title", className: "font-semibold min-w-[200px]" },
  {
    key: "slug",
    label: "Slug",
    className: "min-w-[190px]",
    render: (row) => (
      <div className="bg-white/20 w-fit px-2 py-1 rounded-md font-semibold italic">
        /{row.slug}
      </div>
    ),
  },
  { key: "category", label: "Category", className: "min-w-[120px]" },
  {
    key: "status",
    label: "Status",
    className: "min-w-[120px]",
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
    key: "highlight",
    label: "Highlight",
    className: "min-w-[120px]",
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
  { key: "date", label: "Tanggal Upload", className: "min-w-[200px]" },
];

export default function ArticlePage() {
  const statusArr = ["All", "Draft", "Archive", "Publish"];
  const pageLength = ["10", "20", "100"];
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<TableArticle | null>(
    null
  );

  // Custom Fetch Hooks yey
  const { articles, isLoading, setSearchTerm, fetchArticles } = useArticles();

  const handleDelete = async (row: TableArticle) => {
    const token = getToken();
    if (!token) {
      toast.error("Token tidak ditemukan");
      return;
    }

    const originalId = row.originalId || row.id;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/article/${originalId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Artikel berhasil dihapus");
        window.location.reload();
      } else {
        toast.error(data.message || "Gagal menghapus artikel");
      }
    } catch (err) {
      console.error("Error deleting article:", err);
      toast.error("Terjadi kesalahan saat menghapus artikel");
    } finally {
      setShowAlertDelete(false);
      setSelectedArticle(null);
    }
  };

  // Handle search
  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle limit change
  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
    setCurrentPage(1);
  };

  const handleEdit = (row: TableArticle) => {
    const original = articles.find((a) => a.id === row.id);
    if (original) {
      localStorage.setItem(
        "editArticleData",
        JSON.stringify({
          id: original.originalId || row.id,
          judul: row.title,
          kategori: row.category,
          konten: row.content,
          status: row.status.toUpperCase(),
          date: row.date,
          slug: row.slug,
          excerpt: row.excerpt,
          highlight: row.highlight,
        })
      );
      router.push(`/article/${original.originalId || row.id}/edit`);
    }
  };

  // Filter by status
  const filteredArticles = articles.filter((article) => {
    const matchesStatus =
      statusFilter === "All" || article.status === statusFilter.toLowerCase();
    return matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredArticles.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const paginatedArticles = filteredArticles.slice(
    startIndex,
    startIndex + limit
  );

  // Generate page numbers
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {showAlertDelete && selectedArticle && (
        <AlertDialogComponent
          open={showAlertDelete}
          onOpenChange={(open) => {
            setShowAlertDelete(open);
            if (!open) {
              setSelectedArticle(null);
            }
          }}
          header="Hapus Artikel"
          desc={`Apakah Anda yakin ingin menghapus artikel "${selectedArticle?.title}"?`}
          continueAction={() =>
            selectedArticle && handleDelete(selectedArticle)
          }
        />
      )}

      <Wrapper className="flex flex-col">
        {/* Header Action */}
        <section className="flex items-center justify-between gap-0 w-full mb-4">
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  className="w-100 pr-10"
                  placeholder="Cari judul..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer"
                  onClick={handleSearch}
                />
              </div>
              <Button onClick={handleSearch}>
                <IoSearch />
                <span>Search</span>
              </Button>
            </div>
            <div>
              <SelectComponent
                label="Filter By status"
                placeholder="Filter By status"
                options={statusArr.map((s) => ({ label: s, value: s }))}
                value={statusFilter}
                onChange={(v) => {
                  setStatusFilter(v);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Button onClick={() => fetchArticles()}>
              <MdOutlineLoop />
              <span>Refresh</span>
            </Button>
          </div>
          <div>
            <Link href="/article/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Artikel Baru
              </Button>
            </Link>
          </div>
        </section>

        {/* Table */}
        <section className="flex-1 min-h-0">
          {isLoading ? (
            <TableSkeleton columns={4} rows={4} showActions={true} />
          ) : (
            <>
              <TableList
                columns={articleColumns}
                data={paginatedArticles}
                onEdit={handleEdit}
                onDelete={(row) => {
                  setSelectedArticle(row);
                  setShowAlertDelete(true);
                }}
              />
              {paginatedArticles.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  Tidak ada data artikel yang ditemukan
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
              Menampilkan {startIndex + 1} -{" "}
              {Math.min(startIndex + limit, filteredArticles.length)} dari{" "}
              {filteredArticles.length} data
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

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
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
