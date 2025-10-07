"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Save } from "lucide-react";
import { toast } from "sonner";

// Components
import { Wrapper } from "@/components/wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectComponent } from "@/components/ui/select";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { HeaderActions } from "@/components/header-actions";
import { RadioGroupField } from "@/components/radio-group-field";
import { Textarea } from "@/components/ui/textarea";

// Dynamic Import - Jodit Editor
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>
  ),
});

// Constants
const STATUS_OPTIONS = [
  { label: "Draft", value: "DRAFT", color: "yellow" as const },
  { label: "Publish", value: "PUBLISH", color: "green" as const },
  { label: "Archive", value: "ARCHIVE", color: "gray" as const },
];

const HIGHLIGHT_OPTIONS = [
  { label: "Active", value: "active", color: "green" as const },
  { label: "Inactive", value: "inactive", color: "gray" as const },
];

interface Media {
  id: number;
  url: string;
  type: string;
  title: string | null;
  alt: string | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ArticleData {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: "DRAFT" | "PUBLISH" | "ARCHIVE";
  highlight: boolean;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  thumbnail?: {
    id: number;
    url: string;
    title: string;
    alt: string;
  };
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [highlight, setHighlight] = useState("inactive");
  const [excerpt, setExcerpt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Media State
  const [medias, setMedias] = useState<Media[]>([]);
  const [thumbnailId, setThumbnailId] = useState<number | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [dataCategories, setDataCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Get token safely
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  // Fetch article data
  const fetchArticleData = async () => {
    const token = getToken();
    if (!token) {
      toast.error("Token tidak ditemukan");
      setIsFetching(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/article/${articleId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.success && data.data) {
        const article: ArticleData = data.data;
        fillForm(article);
      } else {
        toast.error(data.message || "Gagal mengambil data artikel");
      }
    } catch (err) {
      console.error("Error fetching article:", err);
      toast.error("Gagal mengambil data artikel");
    } finally {
      setIsFetching(false);
    }
  };

  // Fill form with article data
  const fillForm = (article: ArticleData) => {
    setTitle(article.title || "");
    setSlug(article.slug || "");
    setExcerpt(article.excerpt || "");
    setCategory(String(article.category.id) || "");
    setContent(article.content || "");
    setStatus(article.status || "DRAFT");
    setHighlight(article.highlight ? "active" : "inactive");
    
    if (article.thumbnail) {
      setThumbnailId(article.thumbnail.id);
    }
  };

  // Fetch categories
  const fetchDataCategory = async () => {
    const token = getToken();
    if (!token) {
      toast.error("Token tidak ditemukan");
      return;
    }

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

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setDataCategories(data.data);
      } else {
        toast.error(data.message || "Gagal mengambil kategori");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Gagal mengambil data kategori");
    }
  };

  // Fetch media (for thumbnail)
  const getMedias = async (currentSearch = "", currentPage = 1) => {
    const token = getToken();
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/media?search=${currentSearch}&page=${currentPage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      if (data.success) {
        setMedias(data.data);
        setTotalPages(data.totalPages || 1);
      } else {
        toast.error(data.message || "Gagal mengambil data media");
      }
    } catch (err) {
      console.error("Error fetching media:", err);
      toast.error("Gagal mengambil data media");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (articleId) {
      fetchArticleData();
      fetchDataCategory();
      getMedias();
    }
  }, [articleId]);

  // Auto generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    const generatedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setSlug(generatedSlug);
  };

  // Handle submit
  const handleSubmit = async () => {
    const token = getToken();
    if (!token) {
      toast.error("Anda belum login!");
      return;
    }

    // Validation
    if (!title.trim()) {
      toast.error("Judul artikel wajib diisi!");
      return;
    }

    if (!slug.trim()) {
      toast.error("Slug wajib diisi!");
      return;
    }

    if (!category) {
      toast.error("Kategori wajib dipilih!");
      return;
    }

    if (!content.trim()) {
      toast.error("Konten artikel wajib diisi!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/article/${articleId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            slug: slug.trim(),
            excerpt: excerpt.trim(),
            content: content.trim(),
            categoryId: Number(category),
            status: status,
            highlight: highlight === "active",
            thumbnailId: thumbnailId,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Artikel berhasil diperbarui!");
        router.push("/article");
      } else {
        toast.error(data.message || "Gagal memperbarui artikel");
      }
    } catch (err) {
      console.error("Error updating article:", err);
      toast.error("Terjadi kesalahan saat memperbarui artikel");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/article");
  };

  // Handler untuk memilih thumbnail
  const handleSelectThumbnail = (mediaId: number) => {
    setThumbnailId(mediaId);
    setShowMediaModal(false);
    toast.success("Thumbnail dipilih!");
  };

  // Handler untuk menghapus thumbnail
  const handleRemoveThumbnail = () => {
    setThumbnailId(null);
    toast.success("Thumbnail dihapus!");
  };

  if (isFetching) {
    return (
      <Wrapper>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading article data...</p>
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <>
      {/* Header Actions */}
      <HeaderActions position="left">
        <h1 className="text-xs capitalize px-4 py-2 font-semibold bg-black/50 dark:bg-white/10 rounded-full border border-neutral-300/10 text-white">
          Edit Article #{articleId}
        </h1>
      </HeaderActions>

      <HeaderActions position="right">
        <div className="flex items-center gap-2">
          <AlertDialogComponent
            header="Batalkan Perubahan?"
            desc="Semua perubahan yang belum disimpan akan hilang."
            continueAction={handleCancel}
          >
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
                Batal
              </Button>
            </AlertDialogTrigger>
          </AlertDialogComponent>

          <AlertDialogComponent
            header="Update Artikel?"
            desc={`Artikel akan diperbarui dengan status: ${status.toLowerCase()}`}
            continueAction={handleSubmit}
          >
            <AlertDialogTrigger asChild>
              <Button size="sm" className="w-30" disabled={isLoading}>
                <Save className="w-4 h-4 mr-1" />
                {isLoading ? "Menyimpan..." : "Update"}
              </Button>
            </AlertDialogTrigger>
          </AlertDialogComponent>
        </div>
      </HeaderActions>

      {/* Main Content */}
      <Wrapper className="grid grid-cols-1 lg:grid-cols-10 gap-5">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-7 space-y-5">
          {/* Title */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-white">
              Judul Artikel *
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Masukkan judul artikel..."
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Content Editor */}
          <div className="space-y-3">
            <Label className="text-white">Konten Artikel *</Label>
            <div className="rounded-lg border bg-white dark:bg-gray-900 overflow-hidden">
              <JoditEditor
                value={content}
                onBlur={(newContent) => setContent(newContent)}
                onChange={() => {}}
                config={{
                  minHeight: 400,
                  placeholder: "Tulis konten artikel di sini...",
                  readonly: isLoading,
                  toolbarAdaptive: false,
                  buttons: [
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "|",
                    "ul",
                    "ol",
                    "|",
                    "outdent",
                    "indent",
                    "|",
                    "font",
                    "fontsize",
                    "brush",
                    "|",
                    "image",
                    "video",
                    "table",
                    "link",
                    "|",
                    "align",
                    "undo",
                    "redo",
                    "|",
                    "preview",
                    "fullscreen",
                  ],
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="lg:col-span-3 space-y-5">
          {/* Thumbnail Picker */}
          <div className="space-y-3">
            <Label className="text-white">Thumbnail</Label>
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
              onClick={() => setShowMediaModal(true)}
            >
              {thumbnailId ? (
                <div className="relative">
                  <img
                    src={medias.find((m) => m.id === thumbnailId)?.url}
                    alt="Thumbnail"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center">
                    <div className="text-white text-sm opacity-0 hover:opacity-100 transition-opacity">
                      Klik untuk mengganti
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-80"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveThumbnail();
                    }}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-sm text-gray-400">
                  <div className="text-lg mb-2">📷</div>
                  <div>Klik untuk memilih thumbnail</div>
                </div>
              )}
            </div>
          </div>

          {/* Slug */}
          <div className="space-y-3">
            <Label htmlFor="slug" className="text-white">
              Slug *
            </Label>
            <Input
              id="slug"
              type="text"
              placeholder="slug-artikel"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-400">
              URL-friendly version of the title
            </p>
          </div>

          {/* Excerpt */}
          <div className="space-y-3">
            <Label htmlFor="excerpt" className="text-white">
              Ringkasan
            </Label>
            <Textarea
              id="excerpt"
              className="resize-none h-24"
              placeholder="Ringkasan singkat tentang artikel ini..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Category */}
          <div className="space-y-3">
            <Label className="text-white">Kategori *</Label>
            {dataCategories.length === 0 ? (
              <div className="text-sm text-gray-400 italic">
                {isLoading
                  ? "Memuat kategori..."
                  : "Tidak ada kategori tersedia"}
              </div>
            ) : (
              <SelectComponent
                placeholder="Pilih Kategori"
                options={dataCategories.map((cat) => ({
                  label: cat.name,
                  value: String(cat.id),
                }))}
                value={category}
                onChange={setCategory}
                disabled={isLoading}
              />
            )}
          </div>

          {/* Status */}
          <RadioGroupField
            id="status"
            label="Status"
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS}
            disabled={isLoading}
          />

          {/* Highlight */}
          <RadioGroupField
            id="highlight"
            label="Highlight"
            value={highlight}
            onChange={setHighlight}
            options={HIGHLIGHT_OPTIONS}
            disabled={isLoading}
          />
        </div>
      </Wrapper>

      {/* Media Selection Modal - Untuk thumbnail */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-semibold">Pilih Thumbnail</h2>
              <Button variant="ghost" onClick={() => setShowMediaModal(false)}>
                ✕
              </Button>
            </div>

            {/* Search bar */}
            <div className="flex items-center gap-3 p-4 border-b">
              <Input
                placeholder="Cari media berdasarkan judul..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="flex-1"
              />
              <Button
                variant="secondary"
                onClick={() => getMedias(search, 1)}
                disabled={isLoading}
              >
                Cari
              </Button>
            </div>

            {/* Media grid */}
            <div className="p-6 overflow-y-auto flex-grow">
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-full h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : medias.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {medias
                    .filter((m) => m.type.startsWith("image"))
                    .map((media) => (
                      <div
                        key={media.id}
                        className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                          media.id === thumbnailId
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        onClick={() => handleSelectThumbnail(media.id)}
                      >
                        <img
                          src={media.url}
                          alt={media.alt || ""}
                          className="w-full h-20 object-cover"
                        />
                        <div className="p-2 text-xs truncate">
                          {media.title || "Untitled"}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 italic">
                  Tidak ada media ditemukan.
                </p>
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center p-6 border-t">
              <p className="text-sm text-gray-500">
                Halaman {page} dari {totalPages}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1 || isLoading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages || isLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
