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
import { useEffect, useState } from "react";
import { HiViewGrid } from "react-icons/hi";
import { HiMiniListBullet } from "react-icons/hi2";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { MediaSkeleton } from "@/components/skeletons/media-skeletons";
import { SelectComponent } from "@/components/ui/select";

type MediaItem = {
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

interface Medias {
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
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [dialogPreview, setdialogPreview] = useState(false);
  const [dialogNew, setDialogNew] = useState(false);
  const [medias, setMedias] = useState<Medias[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    file: null as File | null,
    title: "",
    type: "",
  });
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    currentPage: 1,
  });
  const [fetchFunction, setFetchFunction] = useState<
    ((search?: string, page?: number) => void) | null
  >(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

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

  // Fetch data media
  useEffect(() => {
    if (!token) return;

    async function getMedias(search: string = "", page: number = 1) {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/media?search=${encodeURIComponent(
            search
          )}&page=${page}&limit=12`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (res.ok) {
          setMedias(data.data);
          setPagination({
            total: data.pagination.total,
            totalPages: data.pagination.totalPages,
            currentPage: data.pagination.currentPage,
          });
        } else {
          toast.error(data.message || "Gagal mengambil data media");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    }

    // initial fetch
    getMedias();
    setFetchFunction(() => getMedias);
  }, [token]);

  // Upload media baru
  async function handleNewMedia(e: React.FormEvent<HTMLFormElement>) {
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

      setMedias((prev) => [data.data, ...prev]);
      toast.success("Media berhasil diupload!");
      setDialogNew(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  const handleMediaClick = (media: MediaItem) => {
    setSelectedMedia(media);
    setdialogPreview(true);
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

      setMedias((prev) => prev.filter((m) => m.id !== selectedMedia.id));
      toast.success("Media berhasil dihapus");
      setdialogPreview(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
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
            <div className="flex items-center gap-2">
              <SearchInput
                className="max-w-sm"
                placeholder="Search media..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                variant="secondary"
                onClick={() => fetchFunction && fetchFunction(search, 1)}
              >
                Cari
              </Button>
            </div>

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
          ) : status === "grid" ? (
            <div className="grid grid-cols-4 gap-4">
              {medias.map((media) => (
                <div
                  key={media.id}
                  onClick={() => handleMediaClick(media as any)}
                  className="relative border border-lightColor/10 dark:border-darkColor/10 rounded-third overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all duration-200 group"
                >
                  <Image
                    width={500}
                    height={500}
                    src={media.url}
                    alt={media.alt}
                    className="aspect-square object-cover group-hover:scale-105 transition-transform duration-200"
                  />
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
                    onClick={() => handleMediaClick(media as any)}
                    className="border-b border-lightColor/10 dark:border-darkColor/10 hover:bg-lightColor/10 dark:hover:bg-darkColor/10 cursor-pointer"
                  >
                    <td className="p-2">
                      <Image
                        width={200}
                        height={200}
                        src={media.url}
                        alt={media.alt}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </td>
                    <td className="p-2 text-sm text-white">{media.title}</td>
                    <td className="p-2 text-sm text-white">{media.type}</td>
                    <td className="p-2 text-sm text-white">
                      {(media.size / 1024).toFixed(2)} KB
                    </td>
                    <td className="p-2 text-sm text-white">
                      {media.createdAt}
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
              onClick={() =>
                fetchFunction &&
                fetchFunction(search, pagination.currentPage - 1)
              }
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
              onClick={() =>
                fetchFunction &&
                fetchFunction(search, pagination.currentPage + 1)
              }
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
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Nama file"
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
                {/* hidden input supaya ikut ke FormData */}
                <input type="hidden" name="type" value={formValues.type} />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Preview */}
      <Dialog open={dialogPreview} onOpenChange={setdialogPreview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedMedia?.title}
            </DialogTitle>
            <DialogDescription>{selectedMedia?.alt}</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedMedia && (
              <Image
                width={800}
                height={800}
                src={selectedMedia.url}
                alt={selectedMedia.alt}
                className="rounded-lg object-contain w-full"
              />
            )}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileType className="w-5 h-5 text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-sm text-neutral-300">Type</p>
                  <p className="dark:text-white">{selectedMedia?.type}</p>
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
                    {selectedMedia?.createdAt.toLocaleString?.()}
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
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
