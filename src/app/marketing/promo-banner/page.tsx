"use client";

import { Wrapper } from "@/components/wrapper";
import { HeaderActions } from "@/components/header-actions";
import { Button } from "@/components/ui/button";
import { SiGoogleadsense } from "react-icons/si";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePromos } from "@/hooks/usePromos";
import Image from "next/image";
import { FiEdit } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { RadioGroupField } from "@/components/radio-group-field";
import { RiWhatsappLine } from "react-icons/ri";

// interface PromoBanner {
//   id: number;
//   url_desktop: string; // Fixed typo
//   url_mobile: string;
//   url: string;
//   alt: string;
//   isPopup: boolean; // Added isPopup
//   createdAt: string;
// }

const ISPOPUP_OPTIONS = [
  { label: "Active", value: "active", color: "green" as const },
  { label: "Inactive", value: "inactive", color: "gray" as const },
];

function PromoBannerPage() {
  // const [_, setCurrentBanner] = useState<PromoBanner | null>(null);
  // const [desktopFile] = useState<File | null>(null);
  // const [mobileFile, setMobileFile] = useState<File | null>(null);

  const {
    dialogNew,
    setDialogNew,
    editMode,
    alt,
    setAlt,
    url,
    setUrl,
    isPopup,
    setIsPopup, // Added isPopup from hook
    desktopPreview,
    mobilePreview,
    handleDesktopUpload,
    handleMobileUpload,
    banners,
    loading,
    handleSubmit,
    deleteBanner,
    editBanner,
    handleCancel,
  } = usePromos();

  // const resetForm = () => {
  //   setDesktopFile(null);
  //   setMobileFile(null);
  //   setAlt("");
  //   setUrl("");
  //   setCurrentBanner(null);
  // };

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
              {/* DESKTOP 16:9 */}
              <div className="space-y-2">
                <p className="text-white/80 text-sm">Desktop (16:9)</p>
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
                    <span className="text-white/60 text-sm">Choose file</span>
                  )}
                </label>
                {editMode && (
                  <p className="text-xs text-yellow-400">
                    Leave empty to keep current image
                  </p>
                )}
              </div>

              {/* MOBILE RECTANGLE */}
              <div className="space-y-2">
                <p className="text-white/80 text-sm">
                  Mobile (Rectangle / Square)
                </p>
                <label className="relative w-full h-40 border border-dashed border-white/30 flex items-center justify-center rounded-lg cursor-pointer hover:bg-white/5 transition">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleMobileUpload}
                  />
                  {mobilePreview ? (
                    <Image
                      src={mobilePreview}
                      alt="Mobile preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-white/60 text-sm">Choose file</span>
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

            {/* <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading
                  ? "Saving..."
                  : editMode
                  ? "Update Banner"
                  : "Save Banner"}
              </Button>
            </div> */}
          </section>
        )}

        {/* GALLERY LIST */}
        <section className="bg-white/10 rounded-lg p-4 space-y-4">
          {loading && banners.length === 0 ? (
            <p className="text-white/50 text-sm">Loading banners...</p>
          ) : banners.length === 0 ? (
            <p className="text-white/50 text-sm">No banners uploaded.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="w-fit relative bg-white/5 rounded-lg overflow-hidden border border-white/10 p-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {/* Desktop */}
                    <div className="space-y-1">
                      <div className="w-full aspect-video relative">
                        <Image
                          src={banner.url_desktop} // Fixed typo
                          alt={banner.alt}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <p className="text-xs text-white/60">Desktop</p>
                    </div>

                    {/* Mobile */}
                    <div className="space-y-1">
                      <div className="h-19 w-19 relative">
                        <Image
                          src={banner.url_mobile}
                          alt={banner.alt}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <p className="text-xs text-white/60">Mobile</p>
                    </div>
                  </div>

                  {/* Banner Info */}
                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-white font-medium">
                      {banner.alt}
                    </p>
                    <p className="text-xs text-white/60 break-all">
                      {banner.url.slice(0, 50) + "...."}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-end justify-between">
                    <div className="flex gap-1 mt-4">
                      <button
                        onClick={() => editBanner(banner)}
                        className="p-2 bg-darkColor/50 hover:bg-darkColor/50 rounded-md transition"
                        disabled={loading}
                      >
                        <FiEdit className="text-sm text-white" />
                      </button>
                      <button
                        onClick={() => deleteBanner(banner.id)}
                        className="p-2 bg-red-800/80 rounded-md hover:bg-red-500/80 transition"
                        disabled={loading}
                      >
                        <FiTrash2 className="text-sm text-white" />
                      </button>
                    </div>
                    <div className="flex items-end gap-2">
                      <p className="text-xs text-white/40">
                        Created:{" "}
                        {new Date(banner.createdAt).toLocaleDateString()}
                      </p>

                      {/* Conditional badge untuk popup */}
                      {banner.isPopup && (
                        <div className="bg-yellow-500/30 drop-shadow-xl border-yellow-500 py-1 px-2 rounded-full text-xs">
                          <p>popup</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </Wrapper>
    </>
  );
}

export default PromoBannerPage;