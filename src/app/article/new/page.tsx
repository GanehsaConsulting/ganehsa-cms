"use client";

import { Wrapper } from "@/components/wrapper";
import { InputWithLabel } from "@/components/ui/input-label";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/navigation";

interface Field {
  key: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  options?: { label: string; value: string }[];
  boolean?: boolean;
}

const tempDataKategori = ["website", "pajak", "HAKI"];

const articleInputFields: Field[] = [
  {
    key: "title",
    label: "Judul",
    type: "text",
    placeholder: "Masukkan Judul Artikel...",
  },
  {
    key: "category",
    label: "Kategori",
    type: "select",
    options: tempDataKategori.map((item) => ({
      label: item.charAt(0).toUpperCase() + item.slice(1),
      value: item,
    })),
  },
  {
    key: "content",
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

const NewArticlePage = () => {
  const router = useRouter();

  // State form
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Handle change tiap field
  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    console.log("Form Values:", values);
  };

  return (
    <Wrapper>
      <form className="grid gap-7">
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
              desc="This action cannot be undone This will permanently delete your progress!"
              continueAction={() => router.push("/article")}
            >
              <AlertDialogTrigger asChild>
                <Button variant="cancel" className="text-base h-10 w-25">
                  Cancel
                </Button>
              </AlertDialogTrigger>
            </AlertDialogComponent>

            <AlertDialogComponent
              header="Are You Sure to Add New Article?"
              desc={`Are you sure to add new article with status: ${
                formData.status ?? "draft"
              }?`}
              continueAction={() => {
                handleSubmit;
              }}
            >
              <AlertDialogTrigger asChild>
                <Button className="text-base h-10 w-25">
                  <Plus className="text-xl" />
                  Post
                </Button>
              </AlertDialogTrigger>
            </AlertDialogComponent>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default NewArticlePage;
