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
import { ChevronDownIcon, Save } from "lucide-react";
import { useState, useEffect, useCallback } from "react"; // Added useCallback
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { getToken } from "@/lib/helpers";
import { useMedias } from "@/hooks/useMedias";
import Image from "next/image"; // Added Image import

const SHOW_TITLE = [
  { label: "Active", value: "active", color: "green" as const },
  { label: "Inactive", value: "inactive", color: "gray" as const },
];

interface Activity {
  id: number;
  title: string;
  desc: string;
  longDesc: string;
  date: string;
  showTitle: boolean;
  instaUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    email: string;
  };
  medias: {
    media: {
      id: number;
      url: string;
      type: string;
      title: string | null;
      alt: string | null;
      size: number;
    };
  }[];
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
  const [time, setTime] = useState("00:00:00");
  const [showTitle, setShowTitle] = useState("inactive");
  const [instaUrl, setInstaUrl] = useState("");
  const [selectedMediaIds, setSelectedMediaIds] = useState<number[]>([]);

  // Media State
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [open, setOpen] = useState(false);
  const { medias, getMedias } = useMedias();

  // Activity data state
  const [activityData, setActivityData] = useState<Activity | null>(null);

  // Function to combine date and time into ISO string
  const combineDateAndTime = (selectedDate: Date, selectedTime: string) => {
    if (!selectedDate) return undefined;

    const [hours, minutes, seconds] = selectedTime.split(":").map(Number);
    const combinedDate = new Date(selectedDate);
    combinedDate.setHours(hours, minutes, seconds || 0, 0);

    return combinedDate.toISOString();
  };

  // Function to extract time from ISO string
  const extractTimeFromISO = (isoString: string) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Fetch activity by ID - wrapped in useCallback to fix dependency warning
  const fetchActivity = useCallback(async () => {
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
        setActivityData(activity);

        // Populate form with existing data
        setTitle(activity.title);
        setDesc(activity.desc);
        setLongDesc(activity.longDesc);

        // Set date and time from existing activity date
        const activityDate = new Date(activity.date);
        setDate(activityDate);
        setTime(extractTimeFromISO(activity.date));

        setShowTitle(activity.showTitle ? "active" : "inactive");
        setInstaUrl(activity.instaUrl || "");

        // Set selected media IDs from existing medias - with null check
        const mediaIds = activity?.medias?.map((mediaItem) => mediaItem.media.id) || [];
        setSelectedMediaIds(mediaIds);
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
  }, [activityId, router]); // Added dependencies

  // Fetch activity data
  useEffect(() => {
    if (activityId) {
      fetchActivity();
    }
  }, [activityId, fetchActivity]); // Added fetchActivity to dependencies

  // Handle select images - using media IDs
  const handleSelectImages = (mediaId: number) => {
    if (selectedMediaIds.includes(mediaId)) {
      // Remove if already selected
      setSelectedMediaIds(selectedMediaIds.filter((id) => id !== mediaId));
      toast.success("Gambar dihapus dari pilihan!");
    } else {
      // Add if not selected
      setSelectedMediaIds([...selectedMediaIds, mediaId]);
      toast.success("Gambar dipilih!");
    }
  };

  // Handle update using PATCH method
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

    // if (!desc.trim()) {
    //   toast.error("Description wajib diisi!");
    //   return;
    // }

    if (!longDesc.trim()) {
      toast.error("Long description wajib diisi!");
      return;
    }

    if (!date) {
      toast.error("Tanggal wajib dipilih!");
      return;
    }

    if (!time) {
      toast.error("Waktu wajib dipilih!");
      return;
    }

    // Combine date and time
    const combinedDateTime = combineDateAndTime(date, time);
    if (!combinedDateTime) {
      toast.error(
        "Terjadi kesalahan dalam mengkombinasikan tanggal dan waktu!"
      );
      return;
    }

    const showTitleBoolean = showTitle === "active";
    if (showTitleBoolean && !instaUrl.trim()) {
      toast.error("Instagram URL wajib diisi ketika Show Title aktif!");
      return;
    }

    setIsLoading(true);
    try {
      const requestBody = {
        title: title.trim(),
        desc: desc.trim(),
        longDesc: longDesc.trim(),
        date: combinedDateTime,
        showTitle: showTitleBoolean,
        instaUrl: instaUrl.trim(),
        mediaIds: selectedMediaIds,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activity/${activityId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
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

  // Get selected media URLs for preview - with proper null checks
  const getSelectedMediaUrls = (): string[] => {
    if (!selectedMediaIds || selectedMediaIds.length === 0) {
      return [];
    }

    return selectedMediaIds
      .map((mediaId) => {
        const media = medias?.find((m) => m.id === mediaId);
        return media?.url || "";
      })
      .filter((url) => url !== "");
  };

  // Remove selected media
  const removeSelectedMedia = (mediaId: number) => {
    setSelectedMediaIds(selectedMediaIds.filter((id) => id !== mediaId));
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
          {/* <div className="space-y-3">
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
          </div> */}

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
          {/* Date and Time Picker */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="date-picker" className="px-1 text-white">
                Date *
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="glass"
                    id="date-picker"
                    className="w-32 justify-between font-normal"
                  >
                    {date ? date.toLocaleDateString("id-ID") : "Select date"}
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
            <div className="flex flex-col gap-3">
              <Label htmlFor="time-picker" className="px-1 text-white">
                Time *
              </Label>
              <Input
                type="time"
                id="time-picker"
                step="1"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>

          {/* Show Title Status */}
          <RadioGroupField
            id="showTitle"
            label="Show Title"
            value={showTitle}
            onChange={setShowTitle}
            options={SHOW_TITLE}
            disabled={isLoading}
          />

          {/* Instagram URL */}
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

          {/* Image Picker */}
          <div className="space-y-3">
            <Label className="text-white">Gambar Activity</Label>
            <div className="space-y-3">
              {/* Selected Images Preview */}
              {getSelectedMediaUrls().length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {getSelectedMediaUrls().map((url, index) => {
                    const mediaId = selectedMediaIds[index];
                    return (
                      <div key={mediaId} className="relative group">
                        <div className="w-full h-20 relative rounded-lg overflow-hidden">
                          <Image
                            src={url}
                            alt={`Selected ${index + 1}`}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              // Fallback if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSelectedMedia(mediaId)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={isLoading}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
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
                    {selectedMediaIds.length} gambar dipilih
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Info */}
          {activityData && (
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-2">
              <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                Informasi Activity
              </h3>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div>ID: {activityData?.id}</div>
                <div>
                  Dibuat:{" "}
                  {new Date(activityData?.createdAt).toLocaleDateString("id-ID")}
                </div>
                <div>
                  Diupdate:{" "}
                  {new Date(activityData?.updatedAt).toLocaleDateString("id-ID")}
                </div>
                <div>Author: {activityData?.author?.name}</div>
              </div>
            </div>
          )}
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
                {medias && medias.length > 0 ? (
                  medias
                    .filter((m) => m.type.startsWith("image"))
                    .map((media) => (
                      <div
                        key={media.id}
                        className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                          selectedMediaIds.includes(media.id)
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        onClick={() => handleSelectImages(media.id)}
                      >
                        <div className="w-full h-20 relative">
                          <Image
                            src={media.url}
                            alt={media.alt || ""}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              // Fallback if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="p-2 text-xs truncate">
                          {media.title || "Untitled"}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 py-8">
                    Tidak ada media tersedia
                  </div>
                )}
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