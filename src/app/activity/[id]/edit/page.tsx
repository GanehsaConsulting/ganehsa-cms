"use client";

import { HeaderActions } from "@/components/header-actions";
import { RadioGroupField } from "@/components/radio-group-field";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Wrapper } from "@/components/wrapper";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import JoditEditor from "jodit-react";
import { ChevronDownIcon, Plus, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

const IS_INSTAGRAM = [
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

interface Activity {
  id: number;
  title: string;
  desc: string;
  longDesc: string;
  date: string;
  isInsta: boolean;
  instaUrl: string;
  imageUrl: string[];
  createdAt: string;
  updatedAt: string;
}

export default function EditActivityPage() {
  const router = useRouter();
  const params = useParams();
  const activityId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  // Form State
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isInsta, setIsInsta] = useState("inactive");
  const [instaUrl, setInstaUrl] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  // Media State
  const [medias, setMedias] = useState<Media[]>([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [open, setOpen] = useState(false);

  // Get token safely
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  // Fetch activity data
  useEffect(() => {
    if (activityId) {
      fetchActivity();
      getMedias();
    }
  }, [activityId]);

  // Fetch activity by ID
  async function fetchActivity() {
    const token = getToken();
    if (!token) {
      toast.error("Token tidak ditemukan");
      return;
    }

    setIsFetching(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activity/${activityId}`,
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
        const activity: Activity = data.data;
        // Populate form with existing data
        setTitle(activity.title);
        setDesc(activity.desc);
        setLongDesc(activity.longDesc);
        setDate(new Date(activity.date));
        setIsInsta(activity.isInsta ? "active" : "inactive");
        setInstaUrl(activity.instaUrl || "");
        setImageUrls(activity.imageUrl || []);
      } else {
        toast.error(data.message || "Gagal mengambil data activity");
        router.push("/activity");
      }
    } catch (err) {
      console.error("Error fetching activity:", err);
      toast.error("Gagal mengambil data activity");
      router.push("/activity");
    } finally {
      setIsFetching(false);
    }
  }

  // Fetch media
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

  // Handle select images
  const handleSelectImages = (mediaUrl: string) => {
    if (imageUrls.includes(mediaUrl)) {
      // Remove if already selected
      setImageUrls(imageUrls.filter(url => url !== mediaUrl));
      toast.success("Gambar dihapus dari pilihan!");
    } else {
      // Add if not selected
      setImageUrls([...imageUrls, mediaUrl]);
      toast.success("Gambar dipilih!");
    }
  };

  // Handle update
  const handleUpdate = async () => {
    const token = getToken();
    if (!token) {
      toast.error("Anda belum login!");
      return;
    }

    // Validasi
    if (!title.trim()) {
      toast.error("Judul activity wajib diisi!");
      return;
    }
    
    if (!desc.trim()) {
      toast.error("Description wajib diisi!");
      return;
    }
    
    if (!longDesc.trim()) {
      toast.error("Long description wajib diisi!");
      return;
    }
    
    if (!date) {
      toast.error("Tanggal upload wajib dipilih!");
      return;
    }

    if (isInsta === "active" && !instaUrl.trim()) {
      toast.error("Instagram URL wajib diisi ketika Instagram aktif!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activity/${activityId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            desc: desc.trim(),
            longDesc: longDesc.trim(),
            date: date.toISOString().split('T')[0], // Format YYYY-MM-DD
            isInsta: isInsta === "active",
            instaUrl: instaUrl.trim(),
            imageUrl: imageUrls,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Activity berhasil diupdate!");
        router.push("/activity");
      } else {
        toast.error(data.message || "Gagal mengupdate activity");
      }
    } catch (err) {
      console.error("Error updating activity:", err);
      toast.error("Terjadi kesalahan saat mengupdate activity");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/activity");
  };

  // Handle delete
  const handleDelete = async () => {
    const token = getToken();
    if (!token) {
      toast.error("Anda belum login!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activity/${activityId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Activity berhasil dihapus!");
        router.push("/activity");
      } else {
        toast.error(data.message || "Gagal menghapus activity");
      }
    } catch (err) {
      console.error("Error deleting activity:", err);
      toast.error("Terjadi kesalahan saat menghapus activity");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Memuat data activity...</div>
      </div>
    );
  }

  return (
    <>
      <HeaderActions position="left">
        <h1 className="text-xs capitalize px-4 py-2 font-semibold bg-black/50 dark:bg-white/10 rounded-full border border-neutral-300/10 text-white">
          Edit Activity
        </h1>
      </HeaderActions>

      <HeaderActions position="right">
        <div className="flex items-center gap-2">
          {/* Delete Button */}
          <AlertDialogComponent
            header="Hapus Activity?"
            desc="Activity yang dihapus tidak dapat dikembalikan."
            continueAction={handleDelete}
            // continueLabel="Hapus"
            // variant="destructive"
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isLoading}>
                Hapus
              </Button>
            </AlertDialogTrigger>
          </AlertDialogComponent>

          {/* Cancel Button */}
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

          {/* Update Button */}
          <AlertDialogComponent
            header="Update Activity?"
            desc="Activity akan diperbarui dengan data yang baru."
            continueAction={handleUpdate}
          >
            <AlertDialogTrigger asChild>
              <Button size="sm" className="w-30" disabled={isLoading}>
                <Save className="w-4 h-4 mr-1" />
                {isLoading ? "Mengupdate..." : "Update"}
              </Button>
            </AlertDialogTrigger>
          </AlertDialogComponent>
        </div>
      </HeaderActions>

      <Wrapper className="grid grid-cols-1 lg:grid-cols-10 gap-5">
        {/* left column */}
        <div className="lg:col-span-7 space-y-5">
          {/* Title */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-white">
              Judul Activity *
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Masukkan judul activity..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="desc" className="text-white">
              Description *
            </Label>
            <Textarea 
              id="desc" 
              placeholder="Masukkan description activity..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Content Editor */}
          <div className="space-y-3">
            <Label className="text-white">Long Description *</Label>
            <div className="rounded-lg border bg-white dark:bg-gray-900 overflow-hidden">
              <JoditEditor
                value={longDesc}
                onBlur={(newContent) => setLongDesc(newContent)}
                onChange={() => {}}
                config={{
                  minHeight: 400,
                  placeholder: "Tulis konten activity di sini...",
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

        {/* right column */}
        <div className="lg:col-span-3 space-y-5">
          {/* Date Picker */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-white">
              Tanggal Upload*
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"glass"}
                  id="date"
                  className="w-full justify-between font-normal"
                >
                  {date ? date.toLocaleDateString('id-ID') : "Pilih tanggal"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDate(date);
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Instagram Status */}
          <RadioGroupField
            id="isInsta"
            label="Instagram"
            value={isInsta}
            onChange={setIsInsta}
            options={IS_INSTAGRAM}
            disabled={isLoading}
          />

          {/* Instagram URL (conditional) */}
          {isInsta === "active" && (
            <div className="space-y-3">
              <Label htmlFor="instaUrl" className="text-white">
                Instagram URL *
              </Label>
              <Input
                id="instaUrl"
                type="text"
                placeholder="https://instagram.com/..."
                value={instaUrl}
                onChange={(e) => setInstaUrl(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Image Picker */}
          <div className="space-y-3">
            <Label className="text-white">Gambar Activity</Label>
            <div className="space-y-3">
              {/* Selected Images Preview */}
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Selected ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== index))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={isLoading}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Image Picker Button */}
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                onClick={() => {
                  getMedias();
                  setShowMediaModal(true);
                }}
              >
                <div className="flex flex-col items-center justify-center h-24 text-sm text-gray-400">
                  <div className="text-lg mb-2">📷</div>
                  <div>Klik untuk memilih gambar</div>
                  <div className="text-xs mt-1">
                    {imageUrls.length} gambar dipilih
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Info */}
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-2">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Informasi Activity
            </h3>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <div>ID: {activityId}</div>
              <div>
                Dibuat: {new Date().toLocaleDateString('id-ID')}
              </div>
              <div>
                Diupdate: {new Date().toLocaleDateString('id-ID')}
              </div>
            </div>
          </div>
        </div>
      </Wrapper>

      {/* Media Selection Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-semibold">Pilih Gambar</h2>
              <Button
                variant="ghost"
                onClick={() => setShowMediaModal(false)}
                disabled={isLoading}
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
                        imageUrls.includes(media.url)
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      onClick={() => handleSelectImages(media.url)}
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
                disabled={isLoading}
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