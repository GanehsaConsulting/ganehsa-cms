"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";

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

// Dynamic Import - Jodit Editor
const JoditEditor = dynamic(() => import("jodit-react"), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>
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

export default function NewArticlePage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [highlight, setHighlight] = useState("inactive"); // ✅ Pertahankan highlight
  const [excerpt, setExcerpt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Media State (hanya thumbnail)
  const [medias, setMedias] = useState<Media[]>([]);
  const [thumbnailId, setThumbnailId] = useState<number | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [dataCategories, setDataCategories] = useState<Category[]>([]);

  // Fetch categories
  async function fetchDataCategory() {
    const token = getToken();
    if (!token) {
      toast.error("Token tidak ditemukan");
      return;
    }

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
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch media (hanya untuk thumbnail)
  async function getMedias() {
    const token = getToken();
    if (!token) return;

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchDataCategory();
    getMedias();
  }, []);

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/article`, {
        method: "POST",
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
          highlight: highlight === "active", // ✅ Convert ke boolean
          thumbnailId: thumbnailId ? Number(thumbnailId) : undefined,
          // ❌ Hapus mediaIds (tidak butuh gallery)
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Artikel berhasil ditambahkan!");
        router.push("/article");
      } else {
        toast.error(data.message || "Gagal menambahkan artikel");
      }
    } catch (err) {
      console.error("Error submitting article:", err);
      toast.error("Terjadi kesalahan saat menambahkan artikel");
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

  return (
    <>
      {/* Header Actions */}
      <HeaderActions position="left">
        <h1 className="text-xs capitalize px-4 py-2 font-semibold bg-black/50 dark:bg-white/10 rounded-full border border-neutral-300/10 text-white">
          Create New Article
        </h1>
      </HeaderActions>

      <HeaderActions position="right">
        <div className="flex items-center gap-2">
          <AlertDialogComponent
            header="Batalkan Pembuatan Artikel?"
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
            header="Simpan Artikel?"
            desc={`Artikel akan disimpan dengan status: ${status.toLowerCase()}`}
            continueAction={handleSubmit}
          >
            <AlertDialogTrigger asChild>
              <Button size="sm" className="w-30" disabled={isLoading}>
                <Plus className="w-4 h-4 mr-1" />
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
            <Label htmlFor="title" className="text-white">Judul Artikel *</Label>
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
                    'bold', 'italic', 'underline', 'strikethrough', '|',
                    'ul', 'ol', '|',
                    'outdent', 'indent', '|',
                    'font', 'fontsize', 'brush', '|',
                    'image', 'video', 'table', 'link', '|',
                    'align', 'undo', 'redo', '|',
                    'preview', 'fullscreen'
                  ]
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
                    src={medias.find(m => m.id === thumbnailId)?.url}
                    alt="Thumbnail"
                    className="w-full h-40 object-cover"
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
            <Label htmlFor="slug" className="text-white">Slug *</Label>
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
            <Label htmlFor="excerpt" className="text-white">Ringkasan</Label>
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
                {isLoading ? "Memuat kategori..." : "Tidak ada kategori tersedia"}
              </div>
            ) : (
              <SelectComponent
                placeholder="Pilih Kategori"
                options={dataCategories.map(cat => ({
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

          {/* ✅ Highlight - DIPERTAHANKAN */}
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
              <Button
                variant="ghost"
                onClick={() => setShowMediaModal(false)}
              >
                ✕
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {medias
                  .filter(m => m.type.startsWith('image'))
                  .map((media) => (
                    <div
                      key={media.id}
                      className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                        media.id === thumbnailId 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      onClick={() => handleSelectThumbnail(media.id)}
                    >
                      <img
                        src={media.url}
                        alt={media.alt || ''}
                        className="w-full h-20 object-cover"
                      />
                      <div className="p-2 text-xs truncate">
                        {media.title || 'Untitled'}
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