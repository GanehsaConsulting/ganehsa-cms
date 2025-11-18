"use client";

import { useState, useEffect } from "react";
import { Wrapper } from "@/components/wrapper";
import { HeaderActions } from "@/components/header-actions";
import { Button } from "@/components/ui/button";
import { SiGoogleadsense } from "react-icons/si";
import { Plus, Trash, X, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getToken } from "@/lib/helpers";
import { usePromos } from "@/hooks/usePromos";

interface PromoBanner {
  id: number;
  url_dekstop: string;
  url_mobile: string;
  url: string;
  alt: string;
  createdAt: string;
}

function PromoBannerPage() {
  const [currentBanner, setCurrentBanner] = useState<PromoBanner | null>(null);
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const token = getToken();

  const {
    dialogNew,
    setDialogNew,
    editMode,
    alt,
    setAlt,
    url,
    setUrl,
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


  const resetForm = () => {
    setDesktopFile(null);
    setMobileFile(null);
    setAlt("");
    setUrl("");
    setCurrentBanner(null);
  };

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
          <Button
            size="sm"
            variant="destructive"
            onClick={handleCancel}
            className="flex items-center gap-1"
            disabled={loading}
          >
            <X className="w-4 h-4" /> Close
          </Button>
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
                <label className="w-full h-40 border border-dashed border-white/30 flex items-center justify-center rounded-lg cursor-pointer hover:bg-white/5 transition">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleDesktopUpload}
                  />
                  {desktopPreview ? (
                    <img
                      src={desktopPreview}
                      className="w-full h-full object-cover rounded-lg"
                      alt="Desktop preview"
                    />
                  ) : (
                    <span className="text-white/60 text-sm">Choose file</span>
                  )}
                </label>
                {editMode && !desktopFile && (
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
                <label className="w-full h-40 border border-dashed border-white/30 flex items-center justify-center rounded-lg cursor-pointer hover:bg-white/5 transition">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleMobileUpload}
                  />
                  {mobilePreview ? (
                    <img
                      src={mobilePreview}
                      className="w-full h-full object-cover rounded-lg"
                      alt="Mobile preview"
                    />
                  ) : (
                    <span className="text-white/60 text-sm">Choose file</span>
                  )}
                </label>
                {editMode && !mobileFile && (
                  <p className="text-xs text-yellow-400">
                    Leave empty to keep current image
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">
                URL<span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="ex: https://example.com/promo"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">
                Alt Text<span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="ex: summer-sale-banner"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-green-600 text-white"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editMode
                  ? "Update Banner"
                  : "Save Banner"}
              </Button>
            </div>
          </section>
        )}

        {/* GALLERY LIST */}
        <section className="bg-white/10 rounded-lg p-4 space-y-4">
          {/* <h1 className="text-lg font-semibold text-white">Banner Gallery</h1> */}

          {loading && banners.length === 0 ? (
            <p className="text-white/50 text-sm">Loading banners...</p>
          ) : banners.length === 0 ? (
            <p className="text-white/50 text-sm">No banners uploaded.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="relative bg-white/5 rounded-lg overflow-hidden border border-white/10 p-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {/* Desktop */}
                    <div className="space-y-1">
                      <img
                        src={banner.url_dekstop}
                        alt={banner.alt}
                        className="w-full aspect-video object-cover rounded-md"
                      />
                      <p className="text-xs text-white/60">Desktop</p>
                    </div>

                    {/* Mobile */}
                    <div className="space-y-1">
                      <img
                        src={banner.url_mobile}
                        alt={banner.alt}
                        className="w-full aspect-square object-cover rounded-md"
                      />
                      <p className="text-xs text-white/60">Mobile</p>
                    </div>
                  </div>

                  {/* Banner Info */}
                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-white font-medium">
                      {banner.alt}
                    </p>
                    <p className="text-xs text-white/60 break-all">
                      URL: {banner.url}
                    </p>
                    <p className="text-xs text-white/40">
                      Created: {new Date(banner.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => editBanner(banner)}
                      className="p-1 bg-darkColor/80 hover:bg-darkColor/50 rounded-md transition"
                      disabled={loading}
                    >
                      <Edit className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={() => deleteBanner(banner.id)}
                      className="p-1 bg-red-800/80 rounded-md hover:bg-red-500/80 transition"
                      disabled={loading}
                    >
                      <Trash className="w-5 h-5 text-white" />
                    </button>
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
