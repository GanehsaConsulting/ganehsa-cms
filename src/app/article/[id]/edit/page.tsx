"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Save, Loader2 } from "lucide-react";
import Image from "next/image";

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
import { toast } from "sonner";
import { getToken } from "@/lib/helpers";
import { useCategory } from "@/hooks/useCategory";
import { Medias } from "@/app/media-library/page";

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

// interface Media {
//   id: number;
//   url: string;
//   type: string;
//   title: string | null;
//   alt: string | null;
// }

interface ArticleData {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: string;
  highlight: boolean;
  categoryId: number;
  thumbnailId: number | null;
  thumbnail?: {
    id: number;
    url: string;
    title: string | null;
    alt: string | null;
  };
  category: {
    id: number;
    name: string;
    slug: string;
  };
  author: {
    id: number;
    name: string | null;
    email: string;
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
  const [medias, setMedias] = useState<Medias[]>([]);
  const [thumbnailId, setThumbnailId] = useState<number | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const { dataCategories } = useCategory();

  // Fetch article data
  // Fetch article data
  useEffect(() => {
    if (!articleId) return;

    async function fetchArticleData() {
      const token = getToken();
      if (!token) {
        toast.error("Anda belum login!");
        return;
      }

      setIsFetching(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/article/${articleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        if (data.success) {
          const article: ArticleData = data.data;
          // Populate form with existing data
          setTitle(article.title);
          setSlug(article.slug);
          setCategory(String(article.categoryId));
          setContent(article.content);
          setStatus(article.status);
          setHighlight(article.highlight ? "active" : "inactive");
          setExcerpt(article.excerpt || "");
          setThumbnailId(article.thumbnailId);
        } else {
          toast.error(data.message || "Gagal mengambil data artikel");
          router.push("/article");
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        toast.error("Gagal mengambil data artikel");
        router.push("/article");
      } finally {
        setIsFetching(false);
      }
    }

    fetchArticleData();
  }, [articleId, router]);

  // Fetch media for thumbnail selection
  useEffect(() => {
    getMedias();
  }, []);

  // Fetch media (for thumbnail selection)
  async function getMedias() {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setMedias(data.data);
      } else {
        toast.error(data.message || "Gagal mengambil data media");
      }
    } catch (err) {
      console.error("Error fetching media:", err);
      toast.error("Gagal mengambil data media");
    }
  }

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

  // Handle submit for update
  const handleSubmit = async () => {
    const token = getToken();
    if (!token) {
      toast.error("Anda belum login!");
      return;
    }

    // Validasi
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
            thumbnailId: thumbnailId ? Number(thumbnailId) : null,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Artikel berhasil diperbarui!");
        router.push("/article");
      } else {
        // Handle specific errors
        if (data.message === "Slug already exists") {
          toast.error(
            "Slug sudah digunakan. Silakan gunakan slug yang berbeda."
          );
        } else {
          toast.error(data.message || "Gagal memperbarui artikel");
        }
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
      <>
        <HeaderActions position="left">
          <h1 className="text-xs capitalize px-4 py-2 font-semibold bg-black/50 dark:bg-white/10 rounded-full border border-neutral-300/10 text-white">
            Edit Article
          </h1>
        </HeaderActions>
        <Wrapper>
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-white">Memuat data artikel...</p>
            </div>
          </div>
        </Wrapper>
      </>
    );
  }

  return (
    <>
      {/* Header Actions */}
      <HeaderActions position="left">
        <h1 className="text-xs capitalize px-4 py-2 font-semibold bg-black/50 dark:bg-white/10 rounded-full border border-neutral-300/10 text-white">
          Edit Article
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
            header="Simpan Perubahan?"
            desc={`Artikel akan diperbarui dengan status: ${status.toLowerCase()}`}
            continueAction={handleSubmit}
          >
            <AlertDialogTrigger asChild>
              <Button size="sm" className="w-30" disabled={isLoading}>
                <Save className="w-4 h-4 mr-1" />
                {isLoading ? "Menyimpan..." : "Simpan"}
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
            <div className="flex justify-between items-center">
              <Label className="text-white">Thumbnail</Label>
              {thumbnailId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveThumbnail}
                  disabled={isLoading}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Hapus
                </Button>
              )}
            </div>
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
              onClick={() => setShowMediaModal(true)}
            >
              {thumbnailId ? (
                <div className="relative w-full h-40">
                  <Image
                    src={
                      medias.find((m) => m.id === thumbnailId)?.url ||
                      "/placeholder.png"
                    }
                    alt="Thumbnail"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">
                    Klik untuk mengganti
                  </div>
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

      {/* Media Selection Modal - Hanya untuk thumbnail */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-semibold">Pilih Thumbnail</h2>
              <Button variant="ghost" onClick={() => setShowMediaModal(false)}>
                ✕
              </Button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
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
                      <div className="w-full h-20 relative">
                        <Image
                          src={media.url}
                          alt={media.alt || ""}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      </div>
                      <div className="p-2 text-xs truncate">
                        {media.title || "Untitled"}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t">
              <Button
                variant="outline"
                onClick={() => setShowMediaModal(false)}
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
