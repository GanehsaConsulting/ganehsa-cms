// app/media/page.tsx
"use client";
import { HeaderActions } from "@/components/header-actions";
import { SearchInput } from "@/components/input-search";
import { RadioGroupField } from "@/components/radio-group-field";
import { Button } from "@/components/ui/button";
import { Wrapper } from "@/components/wrapper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Flower,
  Plus,
  Download,
  Trash2,
  Calendar,
  FileType,
  HardDrive,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { HiViewGrid } from "react-icons/hi";
import { HiMiniListBullet } from "react-icons/hi2";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { MediaSkeleton } from "@/components/skeletons/media-skeletons";
import { SelectComponent } from "@/components/ui/select";
import { useMedias } from "@/hooks/useMedias";

export type MediaItem = {
  id: number;
  url: string;
  type: string;
  title: string;
  alt: string;
  size: number;
  uploadedById: number;
  createdAt: Date;
  updatedAt: Date;
};

export interface Medias {
  id: number;
  url: string;
  type: "image" | "video";
  title: string;
  alt: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  uploadedById: number;
}

const TYPE_OPTIONS = [
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
];

export default function MediaPage() {
  const [status, setStatus] = useState("grid");
  const [selectedMedia, setSelectedMedia] = useState<Medias | null>(null);
  const [dialogPreview, setDialogPreview] = useState(false);
  const [dialogNew, setDialogNew] = useState(false);
  const [formValues, setFormValues] = useState({
    file: null as File | null,
    title: "",
    type: "",
  });
  const [search, setSearch] = useState("");

  const VIEW_OPTIONS = [
    {
      label: <HiViewGrid className="text-lg" />,
      value: "grid",
      color: "blue" as const,
    },
    {
      label: <HiMiniListBullet className="text-lg" />,
      value: "list",
      color: "pink" as const,
    },
  ];

  const {
    token,
    pagination,
    getMedias,
    isLoading,
    setIsLoading,
    medias,
  } = useMedias();

  // Handle search form submission
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getMedias(search, 1);
  };

  // Upload new media
  const handleNewMedia = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return toast.error("Token tidak ditemukan");

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const type = formData.get("type") as string;

    if (!file || !title || !type) {
      toast.error("File, title, dan type wajib diisi");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload gagal");

      // Refresh the media list to include the new upload
      getMedias(search, 1);
      toast.success("Media berhasil diupload!");
      setDialogNew(false);
      setFormValues({ file: null, title: "", type: "" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediaClick = (media: Medias) => {
    setSelectedMedia(media);
    setDialogPreview(true);
  };

  const handleDownload = () => {
    if (selectedMedia) window.open(selectedMedia.url, "_blank");
  };

  const handleDelete = async () => {
    if (!selectedMedia || !token) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/media/${selectedMedia.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menghapus media");

      // Refresh the media list after deletion
      getMedias(search, pagination.currentPage);
      toast.success("Media berhasil dihapus");
      setDialogPreview(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <HeaderActions position="left" hideBreadcrumbs>
        <h1 className="text-lg font-semibold text-white flex items-center gap-2">
          <Flower /> Media Library
        </h1>
      </HeaderActions>

      <HeaderActions position="right">
        <Button size="sm" onClick={() => setDialogNew(true)}>
          <Plus /> Upload Media
        </Button>
      </HeaderActions>

      <Wrapper
        header={
          <div className="sticky top-0 z-20 flex items-center justify-between px-5 pt-5 pb-2">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <SearchInput
                className="max-w-sm"
                placeholder="Search media..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button type="submit" variant="secondary">
                Cari
              </Button>
            </form>

            <RadioGroupField
              id="status"
              label=""
              value={status}
              onChange={setStatus}
              options={VIEW_OPTIONS}
            />
          </div>
        }
      >
        <div className="z-10 -mt-2">
          {isLoading ? (
            <MediaSkeleton variant={status === "grid" ? "grid" : "list"} />
          ) : medias.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
                <Flower className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No media found</h3>
              <p className="text-gray-400 mb-6">
                {search ? "No results match your search criteria." : "Get started by uploading your first media file."}
              </p>
              <Button onClick={() => setDialogNew(true)}>
                <Plus className="w-4 h-4 mr-2" /> Upload Media
              </Button>
            </div>
          ) : status === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {medias.map((media) => (
                <div
                  key={media.id}
                  onClick={() => handleMediaClick(media)}
                  className="relative border border-lightColor/10 dark:border-darkColor/10 rounded-third overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all duration-200 group"
                >
                  <div className="aspect-square relative">
                    <Image
                      fill
                      src={media.url}
                      alt={media.alt}
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="absolute bottom-0 gradient-blur-to-t h-30 bg-gradient-to-t from-darkColor/70 to-transparent rounded-b-third" />
                  <div className="absolute bottom-0 p-4">
                    <h2 className="text-sm font-medium text-white">
                      {media.title}
                    </h2>
                    <p className="text-xs text-neutral-300">
                      {(media.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="border-b border-lightColor/10 dark:border-darkColor/10">
                  <th className="text-left text-sm font-medium text-white p-2">
                    Preview
                  </th>
                  <th className="text-left text-sm font-medium text-white p-2">
                    Title
                  </th>
                  <th className="text-left text-sm font-medium text-white p-2">
                    Type
                  </th>
                  <th className="text-left text-sm font-medium text-white p-2">
                    Size
                  </th>
                  <th className="text-left text-sm font-medium text-white p-2">
                    Uploaded At
                  </th>
                </tr>
              </thead>
              <tbody>
                {medias.map((media) => (
                  <tr
                    key={media.id}
                    onClick={() => handleMediaClick(media)}
                    className="border-b border-lightColor/10 dark:border-darkColor/10 hover:bg-lightColor/10 dark:hover:bg-darkColor/10 cursor-pointer"
                  >
                    <td className="p-2">
                      <div className="w-16 h-16 relative">
                        <Image
                          fill
                          src={media.url}
                          alt={media.alt}
                          className="object-cover rounded-md"
                        />
                      </div>
                    </td>
                    <td className="p-2 text-sm text-white">{media.title}</td>
                    <td className="p-2 text-sm text-white capitalize">{media.type}</td>
                    <td className="p-2 text-sm text-white">
                      {(media.size / 1024).toFixed(2)} KB
                    </td>
                    <td className="p-2 text-sm text-white">
                      {formatDate(media.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {!isLoading && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.currentPage === 1}
              onClick={() => getMedias(search, pagination.currentPage - 1)}
            >
              Previous
            </Button>
            <span className="text-white text-sm">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => getMedias(search, pagination.currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </Wrapper>

      {/* Dialog Upload Media */}
      <Dialog open={dialogNew} onOpenChange={setDialogNew}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleNewMedia}>
            <DialogHeader>
              <DialogTitle>Upload Media Baru</DialogTitle>
              <DialogDescription>
                Unggah file gambar atau video ke library Anda.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/*,video/*"
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormValues(prev => ({ ...prev, file }));
                      // Set title from filename if empty
                      if (!formValues.title) {
                        setFormValues(prev => ({ 
                          ...prev, 
                          title: file.name.replace(/\.[^/.]+$/, "")
                        }));
                      }
                    }
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Nama file"
                  value={formValues.title}
                  onChange={(e) => setFormValues(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-3">
                <Label className="text-white">Type</Label>
                <SelectComponent
                  placeholder="Pilih Type"
                  options={TYPE_OPTIONS}
                  value={formValues.type}
                  onChange={(val) =>
                    setFormValues((prev) => ({
                      ...prev,
                      type: val,
                    }))
                  }
                  className="w-full"
                />
                <input type="hidden" name="type" value={formValues.type} />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Preview */}
      <Dialog open={dialogPreview} onOpenChange={setDialogPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedMedia?.title}
            </DialogTitle>
            <DialogDescription>{selectedMedia?.alt}</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedMedia && (
              <div className="relative aspect-square">
                <Image
                  fill
                  src={selectedMedia.url}
                  alt={selectedMedia.alt}
                  className="rounded-lg object-contain"
                />
              </div>
            )}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileType className="w-5 h-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-sm text-neutral-300">Type</p>
                  <p className="dark:text-white capitalize">{selectedMedia?.type}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <HardDrive className="w-5 h-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-sm text-neutral-300">Size</p>
                  <p className="dark:text-white">
                    {selectedMedia && (selectedMedia.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-sm text-neutral-300">Uploaded</p>
                  <p className="dark:text-white">
                    {selectedMedia && formatDate(selectedMedia.createdAt)}
                  </p>
                </div>
              </div>
              <div className="pt-4 space-y-2">
                <Button onClick={handleDownload} className="w-full">
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
                <Button
                  onClick={handleDelete}
                  className="w-full"
                  variant="destructive"
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> 
                  {isLoading ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}