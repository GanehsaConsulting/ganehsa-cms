"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Save } from "lucide-react";

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
  { label: "Pendirian PT", value: "pendirian-pt" },
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

const EditArticlePage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [highlight, setHighlight] = useState("inactive");
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);

  // Load existing article data
  useEffect(() => {
    const loadArticleData = () => {
      try {
        const storedData = localStorage.getItem("editArticleData");
        if (storedData) {
          const articleData = JSON.parse(storedData);
          fillForm(articleData);
          localStorage.removeItem("editArticleData");
          setLoading(false);
          return;
        }

        const urlData = {
          title: searchParams.get("judul") || "",
          slug: searchParams.get("slug") || "",
          excerpt: searchParams.get("excerpt") || "",
          category: searchParams.get("kategori") || "",
          content: searchParams.get("konten") || "",
          status: searchParams.get("status") || "draft",
          highlight: searchParams.get("switch") || "inactive",
        };

        if (urlData.title) {
          fillForm(urlData);
          setLoading(false);
          return;
        }

        // Simulate fetch from API
        fetchArticleFromAPI();
      } catch (err) {
        console.error("Error loading article:", err);
        setLoading(false);
      }
    };

    loadArticleData();
  }, [searchParams]);

  const fetchArticleFromAPI = async () => {
    try {
      // contoh mock data
      const mockData = {
        title: "Default Article Title",
        slug: "default-article-title",
        excerpt: "Default excerpt here...",
        category: "pajak",
        content: "Default content here...",
        status: "draft",
        highlight: "inactive",
      };

      fillForm(mockData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching article:", err);
      setLoading(false);
    }
  };

  const fillForm = (data: any) => {
    setTitle(data.title || "");
    setSlug(data.slug || "");
    setExcerpt(data.excerpt || "");
    setCategory(data.category || "");
    setContent(data.content || "");
    setStatus(data.status || "draft");
    setHighlight(data.highlight || "inactive");
  };

  // Handlers
  const handleSubmit = () => {
    const formData = {
      title,
      slug,
      excerpt,
      category,
      content,
      status,
      highlight,
      file,
    };
    console.log("Updated Values:", formData);
    // TODO: API update
    router.push("/article");
  };

  const handleCancel = () => {
    router.push("/article");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    const generatedSlug = value
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
    setSlug(generatedSlug);
  };

  if (loading) {
    return (
      <Wrapper>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading article data...</p>
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <>
      {/* Header */}
      <HeaderActions position="left">
        <h1 className="text-xs capitalize px-4 py-2 font-semibold bg-black/50 dark:bg-white/10 rounded-full border border-neutral-300/10 text-white">
          Edit Article #{params.id}
        </h1>
      </HeaderActions>

      <HeaderActions position="right">
        <div className="flex items-center gap-2">
          {/* Cancel Button */}
          <AlertDialogComponent
            header="Are You Sure?"
            desc="This action will discard your changes!"
            continueAction={handleCancel}
          >
            <AlertDialogTrigger asChild>
              <Button variant="glass" size="sm">
                Cancel
              </Button>
            </AlertDialogTrigger>
          </AlertDialogComponent>

          {/* Update Button */}
          <AlertDialogComponent
            header="Update Article?"
            desc={`Are you sure to update this article with status: ${status}?`}
            continueAction={handleSubmit}
          >
            <AlertDialogTrigger asChild>
              <Button size="sm" className="w-30">
                <Save className="w-4 h-4 mr-1" />
                Update
              </Button>
            </AlertDialogTrigger>
          </AlertDialogComponent>
        </div>
      </HeaderActions>

      {/* Main Content */}
      <Wrapper className="grid grid-cols-10 gap-5">
        {/* Left Column */}
        <div className="col-span-7 space-y-5">
          <div className="space-y-3">
            <Label className="text-white">Judul</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-white">Konten</Label>
            <div className="rounded-secondary border bg-lightColor/50 dark:bg-darkColor/50 overflow-hidden jodit-wysiwyg">
              <JoditEditor
                value={content}
                onBlur={(newContent) => setContent(newContent)}
                onChange={() => {}}
                config={{
                  minHeight: 650,
                  placeholder: "Tulis konten artikel di sini...",
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-3 space-y-5">
          <ImagePicker
            label="Article Thumbnail"
            value={image}
            onChange={(file, preview) => {
              setFile(file);
              setImage(preview);
            }}
            aspectRatio="16:9"
            maxSizeMB={5}
          />

          <div className="space-y-3">
            <Label className="text-white">Slug</Label>
            <Input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-white">Excerpt</Label>
            <Textarea
              id="excerpt"
              className="resize-none h-30"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>

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

          <RadioGroupField
            id="status"
            label="Status"
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS}
          />

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
};

export default EditArticlePage;
