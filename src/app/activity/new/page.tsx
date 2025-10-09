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
import { ChevronDownIcon, Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { combineDateAndTime, getToken } from "@/lib/helpers";
import { useMedias } from "@/hooks/useMedias";

const SHOW_TITLE = [
  { label: "active", value: "active", color: "green" as const },
  { label: "in active", value: "inActive", color: "gray" as const },
];

interface Media {
  id: number;
  url: string;
  type: string;
  title: string | null;
  alt: string | null;
}

export default function AddNewActivity() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [showTitle, setshowTitle] = useState("inActive");
  const [instaUrl, setInstaUrl] = useState("");
  const [selectedMediaIds, setSelectedMediaIds] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("00:00:00"); 
  const [showMediaModal, setShowMediaModal] = useState(false);
  const { getMedias, token, medias} = useMedias()

  // Handle select images - now using media IDs
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

  // Handle submit - integrated with the endpoint
  const handleSubmit = async () => {
    if (!token) {
      toast.error("Anda belum login!");
      return;
    }

    // Validasi sesuai endpoint requirements
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
      toast.error("Terjadi kesalahan dalam mengkombinasikan tanggal dan waktu!");
      return;
    }

    // Validasi showTitle boolean conversion
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
        date: combinedDateTime, // Use combined date and time
        showTitle: showTitleBoolean,
        instaUrl: instaUrl.trim(),
        status: "DRAFT", // Default status as per endpoint
        mediaIds: selectedMediaIds.length > 0 ? selectedMediaIds : undefined, // Only include if media selected
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/activity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Activity berhasil ditambahkan!");
        router.push("/activity");
      } else {
        toast.error(data.message || "Gagal menambahkan activity");
      }
    } catch (err) {
      console.error("Error submitting activity:", err);
      toast.error("Terjadi kesalahan saat menambahkan activity");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/activity");
  };

  // Get selected media URLs for preview
  const getSelectedMediaUrls = () => {
    return selectedMediaIds
      .map((mediaId) => {
        const media = medias.find((m) => m.id === mediaId);
        return media?.url || "";
      })
      .filter((url) => url !== "");
  };

  // Remove selected media
  const removeSelectedMedia = (mediaId: number) => {
    setSelectedMediaIds(selectedMediaIds.filter((id) => id !== mediaId));
  };

  return (
    <>
      <HeaderActions position="left">
        <h1 className="text-xs capitalize px-4 py-2 font-semibold bg-black/50 dark:bg-white/10 rounded-full border border-neutral-300/10 text-white">
          Create New Activity
        </h1>
      </HeaderActions>

      <HeaderActions position="right">
        <div className="flex items-center gap-2">
          <AlertDialogComponent
            header="Batalkan Pembuatan Activity?"
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
            header="Simpan Activity?"
            desc="Activity akan disimpan"
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
                    {date ? date.toLocaleDateString() : "Select date"}
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
            onChange={setshowTitle}
            options={SHOW_TITLE}
            disabled={isLoading}
          />

          <div className="space-y-3">
            <Label htmlFor="instaUrl" className="text-white">
              Instagram URL {showTitle === "active" && "*"}
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
                        <img
                          src={url}
                          alt={`Selected ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeSelectedMedia(mediaId)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
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
                <div className="flex flex-col items-center justify-center h-40 text-sm text-gray-400">
                  <div className="text-lg mb-2">📷</div>
                  <div>Klik untuk memilih gambar</div>
                  <div className="text-xs mt-1">
                    {selectedMediaIds.length} gambar dipilih
                  </div>
                </div>
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
                        selectedMediaIds.includes(media.id)
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                      onClick={() => handleSelectImages(media.id)}
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