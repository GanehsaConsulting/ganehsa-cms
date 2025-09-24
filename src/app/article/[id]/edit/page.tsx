// /article/[id]/edit - updated with data receiving
"use client";

import { Wrapper } from "@/components/wrapper";
import { InputWithLabel } from "@/components/ui/input-label";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { useRouter, useParams, useSearchParams } from "next/navigation";

interface Field {
  key: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  options?: { label: string; value: string }[];
}

const tempDataKategori = ["website", "pajak", "HAKI", "Pendirian PT"];

const articleInputFields: Field[] = [
  {
    key: "judul",
    label: "Judul",
    type: "text",
    placeholder: "Masukkan Judul Artikel...",
  },
  {
    key: "kategori",
    label: "Kategori",
    type: "select",
    options: tempDataKategori.map((item) => ({
      label: item.charAt(0).toUpperCase() + item.slice(1),
      value: item,
    })),
  },
  {
    key: "konten",
    label: "Konten",
    type: "textarea",
    placeholder: "Masukkan Konten Artikel...",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Draft", value: "draft" },
      { label: "Archive", value: "archive" },
      { label: "Publish", value: "publish" },
    ],
  },
  {
    key: "switch",
    label: "Highlight",
    type: "select",
    options: [
      { label: "active", value: "active" },
      { label: "inactive", value: "inactive" },
    ],
  },
];

const EditArticlePage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // State form dengan default value
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticleData = () => {
      try {
        // Method 1: Get data from localStorage
        const storedData = localStorage.getItem("editArticleData");
        if (storedData) {
          const articleData = JSON.parse(storedData);
          setFormData(articleData);
          // Clear localStorage after using it
          localStorage.removeItem("editArticleData");
          setLoading(false);
          return;
        }

        // Method 2: Get data from URL params (fallback)
        const urlData = {
          judul: searchParams.get("judul") || "",
          kategori: searchParams.get("kategori") || "",
          konten: searchParams.get("konten") || "",
          status: searchParams.get("status") || "draft",
        };

        // Check if URL params exist
        if (urlData.judul) {
          setFormData(urlData);
          setLoading(false);
          return;
        }

        // Method 3: Fetch from API (when no data available)
        // This is where you'd normally fetch from your API
        fetchArticleFromAPI();
      } catch (error) {
        console.error("Error loading article data:", error);
        setLoading(false);
      }
    };

    loadArticleData();
  }, [searchParams]);

  // Simulasi fetch dari API
  const fetchArticleFromAPI = async () => {
    try {
      // Simulate API call
      // const response = await fetch(`/api/articles/${params.id}`);
      // const articleData = await response.json();

      // For demo purposes, using mock data
      const mockData = {
        judul: "Default Article Title",
        kategori: "pajak",
        konten: "Default content here...",
        status: "draft",
      };

      setFormData(mockData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching article:", error);
      setLoading(false);
    }
  };

  // Handle change tiap field
  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Updated Values:", formData);
    // Di sini bisa tambahkan API call untuk update article
    // updateArticleAPI(params.id, formData);
  };

  // Loading state
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
    <Wrapper>
      {/* <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Article #{params.id}</h1>
        <p className="text-muted-foreground">Update your article information</p>
      </div>
       */}
      <form className="grid gap-7" onSubmit={handleSubmit}>
        {articleInputFields.map((field) => (
          <InputWithLabel
            key={field.key}
            id={field.key}
            label={field.label}
            type={field.type as any}
            placeholder={field.placeholder}
            options={field.options}
            value={formData[field.key] || ""}
            onChange={(val) => handleChange(field.key, val)}
          />
        ))}

        <div className="grid grid-rows-2 sm:grid-cols-2 gap-5">
          <div></div>
          <div className="flex items-center justify-end gap-3.5">
            <AlertDialogComponent
              header="Are You Sure?"
              desc="This action will discard any changes you made!"
              continueAction={() => router.push("/article")}
            >
              <AlertDialogTrigger asChild>
                <Button variant="cancel" className="text-base h-10 w-25">
                  Cancel
                </Button>
              </AlertDialogTrigger>
            </AlertDialogComponent>

            <AlertDialogComponent
              header="Update Article?"
              desc={`Are you sure to update this article with status: ${
                formData.status ?? "draft"
              }?`}
              continueAction={() => {
                console.log("Updating article:", formData);
                // API call untuk update article
                // updateArticleAPI(params.id, formData);
                router.push("/article");
              }}
            >
              <AlertDialogTrigger asChild>
                <Button className="text-base h-10 w-25">
                  <Save className="text-xl" />
                  Update
                </Button>
              </AlertDialogTrigger>
            </AlertDialogComponent>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default EditArticlePage;
