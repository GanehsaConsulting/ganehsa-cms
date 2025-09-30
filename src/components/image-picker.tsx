"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Upload, X, Flower } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import Image from "next/image";

interface ImagePickerProps {
    id?: string;
    label?: string;
    value?: string | null; // URL or base64
    onChange?: (file: File | null, preview: string | null) => void;
    maxSizeMB?: number;
    acceptedFormats?: string[];
    className?: string;
    containerClassName?: string;
    aspectRatio?: "1:1" | "16:9" | "4:3" | "3:2" | "free";
    showPreview?: boolean;
    disabled?: boolean;
}

export const ImagePicker = ({
    id = "image-picker",
    label,
    value = null,
    onChange,
    maxSizeMB = 5,
    acceptedFormats = ["image/jpeg", "image/png", "image/webp", "image/gif"],
    className = "",
    containerClassName = "",
    aspectRatio = "free",
    showPreview = true,
    disabled = false,
}: ImagePickerProps) => {
    const [preview, setPreview] = useState<string | null>(value);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Aspect ratio styles
    const aspectRatioClasses = {
        "1:1": "aspect-square",
        "16:9": "aspect-video",
        "4:3": "aspect-[4/3]",
        "3:2": "aspect-[3/2]",
        free: "",
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            validateAndProcessFile(file);
        }
    };

    const validateAndProcessFile = (file: File) => {
        setError(null);

        // Check file type
        if (!acceptedFormats.includes(file.type)) {
            setError(
                `Format tidak didukung. Gunakan: ${acceptedFormats
                    .map((f) => f.split("/")[1])
                    .join(", ")}`
            );
            return;
        }

        // Check file size
        const fileSizeMB = file.size / 1024 / 1024;
        if (fileSizeMB > maxSizeMB) {
            setError(`Ukuran file maksimal ${maxSizeMB}MB`);
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setPreview(result);
            onChange?.(file, result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemove = () => {
        setPreview(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onChange?.(null, null);
    };

    const handleClick = () => {
        if (!disabled) {
            fileInputRef.current?.click();
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (disabled) return;

        const file = e.dataTransfer.files?.[0];
        if (file) {
            validateAndProcessFile(file);
        }
    };

    return (
        <div className={clsx("w-full space-y-3", containerClassName)}>
            {/* Label */}
            {label && (
                <Label htmlFor={id} className="text-white">
                    {label}
                </Label>
            )}

            {/* Hidden Input */}
            <input
                ref={fileInputRef}
                id={id}
                type="file"
                accept={acceptedFormats.join(",")}
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled}
            />

            {/* Preview or Upload Area */}
            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={clsx(
                    "bg-lightColor/50 dark:bg-darkColor/50 relative border border-lightColor/10 dark:border-darkColor/10 rounded-third overflow-hidden transition-all cursor-pointer group",
                    isDragging &&
                    "border-blue-500 bg-blue-500/10 scale-[1.02]",
                    !preview && "hover:border-gray-500 hover:bg-lightColor/70 dark:hover:bg-darkColor/70",
                    preview && "border-transparent",
                    disabled && "opacity-50 cursor-not-allowed",
                    aspectRatio !== "free" && aspectRatioClasses[aspectRatio],
                    !preview && !aspectRatio && "min-h-[200px]",
                    className
                )}
            >
                {showPreview && preview ? (
                    // Image Preview
                    <>
                        <Image
                            fill
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant="glass"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClick();
                                }}
                                disabled={disabled}
                            >
                                <Upload className="w-4 h-4 mr-1" />
                                Change
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="bg-destructive/50 backdrop-blur-sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                                disabled={disabled}
                            >
                                <X className="w-4 h-4 mr-1" />
                                Remove
                            </Button>
                        </div>
                    </>
                ) : (
                    // Upload Area
                    <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                        <Flower className="w-8 h-8 text-neutral-700/50 dark:text-neutral-200/50" />
                        <p className="text-neutral-700/50 dark:text-neutral-200/50 font-bold mb-1">
                            {isDragging ? "Drop image here" : "Upload Image"}
                        </p>
                        <p className="text-[10px] opacity-30 capitalize">
                            Or Drag & Drop
                            <br />
                            (Max {maxSizeMB}MB, {acceptedFormats.map((f) => f.split("/")[1]).join(", ")})   
                        </p>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                    <X className="w-4 h-4" />
                    {error}
                </p>
            )}
        </div>
    );
};