"use client";

import React, { useState } from "react";
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
import { ImagePicker } from "@/components/image-picker";


// Dynamic Import - Jodit Editor (SSR safe)
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

// Constants
const CATEGORY_OPTIONS = [
  { label: "Website", value: "website" },
  { label: "Pajak", value: "pajak" },
  { label: "HAKI", value: "haki" },
];

const STATUS_OPTIONS = [
  { label: "Draft", value: "draft", color: "yellow" as const },
  { label: "Archive", value: "archive", color: "gray" as const },
  { label: "Publish", value: "publish", color: "green" as const },
];

const HIGHLIGHT_OPTIONS = [
  { label: "Active", value: "active", color: "green" as const },
  { label: "Inactive", value: "inactive", color: "gray" as const },
];

export default function NewArticlePage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [highlight, setHighlight] = useState("inactive");
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);


  // Handlers
  const handleSubmit = () => {
    const formData = {
      title,
      slug,
      category,
      content,
      status,
      highlight,
    };
    console.log("Form Values:", formData);
    // TODO: Implement API call
  };

  const handleCancel = () => {
    router.push("/article");
  };

  // Auto generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    // Generate slug: lowercase, replace spaces with hyphens, remove special chars
    const generatedSlug = value
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
    setSlug(generatedSlug);
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
          {/* Cancel Button */}
          <AlertDialogComponent
            header="Are You Sure?"
            desc="This action cannot be undone. This will permanently delete your progress!"
            continueAction={handleCancel}
          >
            <AlertDialogTrigger asChild>
              <Button variant="glass" size="sm">
                Cancel
              </Button>
            </AlertDialogTrigger>
          </AlertDialogComponent>

          {/* Submit Button */}
          <AlertDialogComponent
            header="Are You Sure to Add New Article?"
            desc={`Are you sure to add new article with status: ${status}?`}
            continueAction={handleSubmit}
          >
            <AlertDialogTrigger asChild>
              <Button size="sm" className="w-30">
                <Plus className="w-4 h-4 mr-1" />
                Post
              </Button>
            </AlertDialogTrigger>
          </AlertDialogComponent>
        </div>
      </HeaderActions>

      {/* Main Content */}
      <Wrapper className="grid grid-cols-10 gap-5">
        {/* Left Column - Main Content */}
        <div className="col-span-7 space-y-5">
          {/* Title */}
          <div className="space-y-3">
            <Label className="text-white">Judul</Label>
            <Input
              id="title"
              type="text"
              placeholder="Masukkan Judul Artikel..."
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          {/* Content Editor */}
          <div className="space-y-3">
            <Label className="text-white">Konten</Label>
            <div className="rounded-secondary border bg-lightColor/50 dark:bg-darkColor/50 overflow-hidden jodit-wysiwyg">
              <JoditEditor
                value={content}
                onBlur={(newContent) => setContent(newContent)}
                onChange={() => { }}
                config={{
                  minHeight: 650,
                  editorClassName: "my-editor",
                  placeholder: "Tulis konten artikel di sini...",
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="col-span-3 space-y-5">
          <ImagePicker
            label="Article Thumbnail"
            value={image}
            onChange={(file, preview) => {
              setFile(file);      // File object untuk upload
              setImage(preview);  // Preview untuk display
            }}
            aspectRatio="16:9"
            maxSizeMB={5}
          />

          {/* Slug */}
          <div className="space-y-3">
            <Label className="text-white">Slug</Label>
            <Input
              id="slug"
              type="text"
              placeholder="Slug akan ter-generate otomatis"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <Label className="text-white">Excerpt</Label>
            <Textarea
              id="slug"
              className="resize-none h-30"
              placeholder="Excerpt artikel untuk preview"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="space-y-3">
            <Label className="text-white">Kategori</Label>
            <SelectComponent
              placeholder="Pilih Kategori"
              options={CATEGORY_OPTIONS}
              value={category}
              onChange={setCategory}
              className="w-full"
            />
          </div>

          {/* Status */}
          <RadioGroupField
            id="status"
            label="Status"
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS}
          />

          {/* Highlight */}
          <RadioGroupField
            id="highlight"
            label="Highlight"
            value={highlight}
            onChange={setHighlight}
            options={HIGHLIGHT_OPTIONS}
          />

        </div>
      </Wrapper>
    </>
  );
}