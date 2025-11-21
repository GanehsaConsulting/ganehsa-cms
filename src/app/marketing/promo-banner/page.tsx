"use client";

import { Wrapper } from "@/components/wrapper";
import { HeaderActions } from "@/components/header-actions";
import { Button } from "@/components/ui/button";
import { SiGoogleadsense } from "react-icons/si";
import { Loader2, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePromos } from "@/hooks/usePromos";
import Image from "next/image";
import { FiEdit } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { RadioGroupField } from "@/components/radio-group-field";
import { RiWhatsappLine } from "react-icons/ri";
import { toast } from "sonner";
import { useEffect } from "react";

// Import Dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ISPOPUP_OPTIONS = [
  { label: "Active", value: "active", color: "green" as const },
  { label: "Inactive", value: "inactive", color: "gray" as const },
];

function PromoBannerPage() {
  const {
    dialogNew,
    setDialogNew,
    editMode,
    alt,
    setAlt,
    url,
    setUrl,
    isPopup,
    setIsPopup,
    desktopPreview,
    mobilePreview,
    handleDesktopUpload,
    handleMobileUpload,
    banners,
    loading,
    handleSubmit,
    deleteBanner, // sekarang ini untuk membuka dialog
    confirmDelete, // untuk eksekusi delete
    editBanner,
    handleCancel,
    error,
    // Delete dialog state
    deleteDialogOpen,
    closeDeleteDialog,
    bannerToDelete,
  } = usePromos();

  // Handle error dengan toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const defaultLink = "https://api.whatsapp.com/send?phone=628887127000";

  return (
    <>
      {/* HEADER LEFT */}
      <HeaderActions position="left" hideBreadcrumbs>
        <h1 className="text-lg font-semibold text-white flex items-center gap-2">
          <SiGoogleadsense /> Promotional Banner
        </h1>
      </HeaderActions>

      {/* HEADER RIGHT (Upload + Close) */}
      <HeaderActions position="right" className="flex gap-2">
        {!dialogNew && (
          <Button
            size="sm"
            onClick={() => setDialogNew(true)}
            disabled={loading}
          >
            <Plus /> Upload Banner
          </Button>
        )}

        {dialogNew && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={handleCancel}
              className="flex items-center gap-1"
              disabled={loading}
            >
              <X className="w-4 h-4" /> Close
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={loading}>
              {loading
                ? "Saving..."
                : editMode
                ? "Update Banner"
                : "Save Banner"}
            </Button>
          </div>
        )}
      </HeaderActions>

      <Wrapper className="flex flex-col space-y-6">
        {/* UPLOAD/EDIT SECTION */}
        {dialogNew && (
          <section className="bg-white/10 rounded-lg p-6 space-y-4">
            <h1 className="text-lg font-semibold text-white">
              {editMode ? "Edit Banner" : "Upload Banner"}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* DESKTOP 16:9 - OPTIONAL */}
              <div className="space-y-2">
                <p className="text-white/80 text-sm">Desktop (16:9) - Optional</p>
                <label className="w-full h-40 relative border border-dashed border-white/30 flex items-center justify-center rounded-lg cursor-pointer hover:bg-white/5 transition">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleDesktopUpload}
                  />
                  {desktopPreview ? (
                    <Image
                      src={desktopPreview}
                      alt="Desktop preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-white/60 text-sm">Choose file (Optional)</span>
                  )}
                </label>
                {editMode && (
                  <p className="text-xs text-yellow-400">
                    Leave empty to keep current image
                  </p>
                )}
              </div>

              {/* MOBILE RECTANGLE - REQUIRED */}
              <div className="space-y-2">
                <p className="text-white/80 text-sm">
                  Mobile (Rectangle / Square)<span className="text-red-500">*</span>
                </p>
                <label className="relative w-full h-40 border border-dashed border-white/30 flex items-center justify-center rounded-lg cursor-pointer hover:bg-white/5 transition">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleMobileUpload}
                    required
                  />
                  {mobilePreview ? (
                    <Image
                      src={mobilePreview}
                      alt="Mobile preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-white/60 text-sm">Choose file (Required)</span>
                  )}
                </label>
                {editMode && (
                  <p className="text-xs text-yellow-400">
                    Leave empty to keep current image
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">
                Link Tujuan<span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  placeholder="ex: https://example.com/promo"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
                <Button
                  onClick={() => {
                    setUrl(defaultLink);
                  }}
                  className="text-sm bg-green-800"
                >
                  <span>
                    <RiWhatsappLine />
                  </span>
                  <span>Use Default Link</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">
                Image Name<span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="ex: summer-sale-banner"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                required
              />
            </div>

            {/* Radio Group untuk isPopup */}
            <RadioGroupField
              id="isPopup"
              label="Jadikan Popup Image Ads"
              value={isPopup}
              onChange={setIsPopup}
              options={ISPOPUP_OPTIONS}
              disabled={loading}
            />
          </section>
        )}

        {/* GALLERY LIST - TABLE VIEW */}
        <section className="bg-white/10 rounded-lg p-4">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-mainColor" />
              <span className="ml-2 text-white/50">Loading banners...</span>
            </div>
          ) : banners.length === 0 ? (
            <p className="text-center py-10 text-white/50">
              No banners uploaded.
            </p>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-sm font-medium text-white p-2">
                    Desktop
                  </th>
                  <th className="text-left text-sm font-medium text-white p-2">
                    Mobile
                  </th>
                  <th className="text-left text-sm font-medium text-white p-2">
                    Name
                  </th>
                  <th className="text-left text-sm font-medium text-white p-2">
                    URL
                  </th>
                  <th className="text-left text-sm font-medium text-white p-2">
                    Popup
                  </th>
                  <th className="text-left text-sm font-medium text-white p-2">
                    Created At
                  </th>
                  <th className="text-left text-sm font-medium text-white p-2">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {banners.map((banner) => (
                  <tr
                    key={banner.id}
                    className="border-b border-white/10 hover:bg-white/5 transition"
                  >
                    {/* Desktop */}
                    <td className="p-2">
                      <div className="w-32 aspect-video relative rounded-md overflow-hidden bg-neutral-800">
                        {banner.url_desktop ? (
                          <Image
                            fill
                            src={banner.url_desktop}
                            alt={banner.alt}
                            className="object-cover"
                            sizes="128px"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-white/40 text-sm">
                            No Image
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Mobile */}
                    <td className="p-2">
                      <div className="w-20 h-20 relative rounded-md overflow-hidden bg-neutral-800">
                        <Image
                          fill
                          src={banner.url_mobile}
                          alt={banner.alt}
                          className="object-cover"
                        />
                      </div>
                    </td>

                    {/* Alt */}
                    <td className="p-2 text-white text-sm font-medium">
                      {banner.alt}
                    </td>

                    {/* URL */}
                    <td className="p-2 text-white/60 text-xs max-w-[200px] break-all">
                      {banner?.url.slice(0, 25) + "..."}
                    </td>

                    {/* Popup Badge */}
                    <td className="p-2">
                      {banner.isPopup ? (
                        <span className="px-2 py-1 text-xs bg-yellow-500/30 border border-yellow-500 rounded-full">
                          Popup
                        </span>
                      ) : (
                        <span className="text-white/40 text-xs">-</span>
                      )}
                    </td>

                    {/* Created At */}
                    <td className="p-2 text-white/60 text-sm">
                      {new Date(banner.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => editBanner(banner)}
                          disabled={loading}
                        >
                          <FiEdit className="w-4 h-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => deleteBanner(banner)}
                          disabled={loading}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </Wrapper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={closeDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the banner {bannerToDelete?.alt}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDeleteDialog}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => bannerToDelete && confirmDelete(bannerToDelete.id)}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Banner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PromoBannerPage;