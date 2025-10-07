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
import { Plus, Search } from "lucide-react"; // Import Search icon
import { TableList, Column } from "@/components/table-list";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react"; // Import useCallback
import { toast } from "sonner";
import { TableSkeleton } from "@/components/skeletons/table-list";
import { HeaderActions } from "@/components/header-actions";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { IoSearch } from "react-icons/io5";
import { MdOutlineLoop } from "react-icons/md";

// Tipe data untuk artikel sesuai response API
interface Article {
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

// Tipe untuk tabel (dengan mapping dari API response)
interface TableArticle {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  category: string;
  content: string;
  date: string;
  status: "draft" | "archive" | "publish";
  highlight: boolean;
  originalId: any;
}

// Styles untuk status
const statusStyles = {
  draft: "text-yellow-700 dark:text-white/80 bg-yellow-200/20",
  archive: "text-blue-700 dark:text-white/80 bg-blue-200/20",
  publish: "text-green-700 dark:text-white/80 bg-green-200/20",
};

// Kolom table
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
  { key: "excerpt", label: "Excerpt", className: "min-w-[200px]" },
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
  { key: "date", label: "Tanggal Upload", className: "min-w-[140px]" },
];

export default function ArticlePage() {
  const statusArr = ["All", "Draft", "Archive", "Publish"];
  const pageLength = ["10", "20", "100"];
  const router = useRouter();
  const [articles, setArticles] = useState<TableArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // State untuk debounced value
  const [statusFilter, setStatusFilter] = useState("All");

  // 🔹 pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 🔹 alert dialog state
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<TableArticle | null>(
    null
  );

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const mapStatus = (status: string): "draft" | "archive" | "publish" => {
    switch (status) {
      case "DRAFT":
        return "draft";
      case "ARCHIVE":
        return "archive";
      case "PUBLISH":
        return "publish";
      default:
        return "draft";
    }
  };

  // Debounce function
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  // Apply debounce to search term
  const debouncedSearch = useDebounce(searchTerm, 500); // 500ms delay

  async function fetchArticles(searchQuery: string = "") {
    const token = getToken();
    if (!token) {
      toast.error("Token tidak ditemukan");
      return;
    }

    setIsLoading(true);
    try {
      // Build URL dengan parameter search jika ada
      const url = searchQuery
        ? `${
            process.env.NEXT_PUBLIC_API_URL
          }/article?search=${encodeURIComponent(searchQuery)}`
        : `${process.env.NEXT_PUBLIC_API_URL}/article`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.success && data.data) {
        const transformed: TableArticle[] = data.data.map(
          (article: Article, index: number) => ({
            id: article.id,
            originalId: article.id,
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt || "-",
            category: article.category.name,
            content: article.content,
            date: formatDate(article.createdAt),
            status: mapStatus(article.status),
            highlight: article.highlight,
          })
        );
        setArticles(transformed);
      } else {
        toast.error(data.message || "Gagal mengambil data artikel");
        setArticles([]);
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
      toast.error("Gagal mengambil data artikel");
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  }

  // Effect untuk fetch data dengan debounced search
  useEffect(() => {
    fetchArticles(debouncedSearchTerm);
    setCurrentPage(1); // Reset ke halaman pertama saat search berubah
  }, [debouncedSearchTerm]);

  // Effect untuk fetch data pertama kali
  useEffect(() => {
    fetchArticles();
  }, []);

  // Handler untuk manual search dengan button
  const handleSearch = () => {
    setDebouncedSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  // Handler untuk tekan Enter di input search
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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

  // ✅ Handle delete dengan AlertDialog
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
        fetchArticles(debouncedSearchTerm); // Refresh dengan search term saat ini
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

  // 🔍 Filter data berdasarkan status (tetap di frontend untuk status filter)
  const filteredArticles = articles.filter((article) => {
    const matchesStatus =
      statusFilter === "All" || article.status === statusFilter.toLowerCase();
    return matchesStatus;
  });

  // 📄 Pagination logic
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      {showAlertDelete && selectedArticle && (
        // Di dalam komponent ArticlePage, ganti bagian AlertDialogComponent dengan:

        <AlertDialogComponent
          open={showAlertDelete}
          onOpenChange={(open) => {
            setShowAlertDelete(open);
            if (!open) {
              setSelectedArticle(null); // Reset selected article ketika dialog ditutup
            }
          }}
          header="Hapus Artikel"
          desc={`Apakah Anda yakin ingin menghapus artikel "${selectedArticle?.title}"?`}
          continueAction={() =>
            selectedArticle && handleDelete(selectedArticle)
          }
        />

        // Dan pastikan AlertDialogComponent TIDAK di-render secara conditional
        // Hapus conditional rendering {showAlertDelete && ...}
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
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    // Debounce akan otomatis terpanggil melalui useEffect
                  }}
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
            // Di dalam ArticlePage, pastikan onDelete di TableList seperti ini:
            <TableList
              columns={articleColumns}
              data={paginatedArticles}
              onEdit={handleEdit}
              onDelete={(row) => {
                console.log("Delete button clicked", row); // Untuk debugging
                setSelectedArticle(row);
                setShowAlertDelete(true);
              }}
            />
          )}
        </section>

        {/* Pagination */}
        <section className="flex items-center justify-between mt-4 w-full">
          <div className="text-white text-sm w-full">
            Menampilkan {paginatedArticles.length} dari{" "}
            {filteredArticles.length} hasil
          </div>
          <Pagination className="flex justify-end text-white">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() =>
                    currentPage > 1 && setCurrentPage(currentPage - 1)
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </section>
      </Wrapper>
    </>
  );
}
