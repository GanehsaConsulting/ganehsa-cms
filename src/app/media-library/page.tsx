"use client"
import { HeaderActions } from "@/components/header-actions";
import { SearchInput } from "@/components/input-search";
import { RadioGroupField } from "@/components/radio-group-field";
import { Button } from "@/components/ui/button";
import { Wrapper } from "@/components/wrapper";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Flower, Plus, Download, Trash2, Calendar, FileType, HardDrive } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { HiViewGrid } from "react-icons/hi";
import { HiMiniListBullet } from "react-icons/hi2";

type MediaItem = {
    id: number;
    url: string;
    type: string;
    title: string;
    alt: string;
    size: number;
    uploadedById: number;
    createdAt: Date;
    updatedAt: Date;
};

export default function MediaPage() {
    const [status, setStatus] = useState("grid");
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const VIEW_OPTIONS = [
        { label: <HiViewGrid className="text-lg" />, value: "grid", color: "blue" as const },
        { label: <HiMiniListBullet className="text-lg" />, value: "list", color: "pink" as const },
    ];

    const dummyMedia: MediaItem[] = [
        {
            id: 1,
            url: "https://picsum.photos/1000/1000?1",
            type: "image",
            title: "Product Image 1",
            alt: "A sample product image",
            size: 204800,
            uploadedById: 1,
            createdAt: new Date("2025-10-01T08:00:00Z"),
            updatedAt: new Date("2025-10-01T08:00:00Z"),
        },
        {
            id: 2,
            url: "https://picsum.photos/1000/1000?2",
            type: "image",
            title: "Product Image 2",
            alt: "Another sample image",
            size: 512000,
            uploadedById: 2,
            createdAt: new Date("2025-10-01T09:15:00Z"),
            updatedAt: new Date("2025-10-01T09:15:00Z"),
        },
        {
            id: 3,
            url: "https://picsum.photos/1000/1000?3",
            type: "video",
            title: "Demo Video",
            alt: "Sample demo video",
            size: 10485760,
            uploadedById: 1,
            createdAt: new Date("2025-10-01T10:30:00Z"),
            updatedAt: new Date("2025-10-01T10:30:00Z"),
        },
        {
            id: 4,
            url: "https://picsum.photos/1000/1000?4",
            type: "image",
            title: "Thumbnail Image",
            alt: "Thumbnail for article",
            size: 102400,
            uploadedById: 3,
            createdAt: new Date("2025-10-01T11:45:00Z"),
            updatedAt: new Date("2025-10-01T11:45:00Z"),
        },
        {
            id: 5,
            url: "https://picsum.photos/1000/1000?5",
            type: "video",
            title: "Presentation Video",
            alt: "Video presentation example",
            size: 20971520,
            uploadedById: 2,
            createdAt: new Date("2025-10-01T12:00:00Z"),
            updatedAt: new Date("2025-10-01T12:00:00Z"),
        },
        {
            id: 6,
            url: "https://picsum.photos/1000/1000?6",
            type: "video",
            title: "Presentation Video",
            alt: "Video presentation example",
            size: 20971520,
            uploadedById: 2,
            createdAt: new Date("2025-10-01T12:00:00Z"),
            updatedAt: new Date("2025-10-01T12:00:00Z"),
        },
        {
            id: 7,
            url: "https://picsum.photos/1000/1000?7",
            type: "video",
            title: "Presentation Video",
            alt: "Video presentation example",
            size: 20971520,
            uploadedById: 2,
            createdAt: new Date("2025-10-01T12:00:00Z"),
            updatedAt: new Date("2025-10-01T12:00:00Z"),
        },
        {
            id: 8,
            url: "https://picsum.photos/1000/1000?8",
            type: "video",
            title: "Presentation Video",
            alt: "Video presentation example",
            size: 20971520,
            uploadedById: 2,
            createdAt: new Date("2025-10-01T12:00:00Z"),
            updatedAt: new Date("2025-10-01T12:00:00Z"),
        },
        {
            id: 9,
            url: "https://picsum.photos/1000/1000?9",
            type: "video",
            title: "Presentation Video",
            alt: "Video presentation example",
            size: 20971520,
            uploadedById: 2,
            createdAt: new Date("2025-10-01T12:00:00Z"),
            updatedAt: new Date("2025-10-01T12:00:00Z"),
        },
        {
            id: 10,
            url: "https://picsum.photos/1000/1000?10",
            type: "video",
            title: "Presentation Video",
            alt: "Video presentation example",
            size: 20971520,
            uploadedById: 2,
            createdAt: new Date("2025-10-01T12:00:00Z"),
            updatedAt: new Date("2025-10-01T12:00:00Z"),
        },
    ];

    const handleMediaClick = (media: MediaItem) => {
        setSelectedMedia(media);
        setIsDialogOpen(true);
    };

    const handleDownload = () => {
        if (selectedMedia) {
            // Simulasi download
            window.open(selectedMedia.url, '_blank');
        }
    };

    const handleDelete = () => {
        if (selectedMedia) {
            // Implementasi delete logic
            console.log('Delete media:', selectedMedia.id);
            setIsDialogOpen(false);
        }
    };

    return (
        <>
            <HeaderActions position="left" hideBreadcrumbs>
                <h1 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Flower /> Media Library
                </h1>
            </HeaderActions>

            <HeaderActions position="right">
                <Button size={"sm"}>
                    <Plus /> Upload Media
                </Button>
            </HeaderActions>

            <Wrapper
                header={
                    <>
                        {/* Background dekoratif */}
                        <div className="absolute top-0 left-0 right-0 w-full h-60 z-10"></div>

                        {/* Search bar dan toggle view */}
                        <div className="sticky top-0 z-20 flex items-center justify-between px-5 pt-5 pb-2">
                            <div className="flex items-center gap-2 w-fit">
                                <SearchInput className="max-w-sm" placeholder="Search media..." />
                                <Button variant={"secondary"}>Cari</Button>
                            </div>
                            <RadioGroupField
                                id="status"
                                label=""
                                value={status}
                                onChange={setStatus}
                                options={VIEW_OPTIONS}
                            />
                        </div>
                    </>
                }
            >
                <div className="z-10 -mt-2">
                    {status === "grid" ? (
                        <div className="grid grid-cols-4 gap-4">
                            {dummyMedia.map((media) => (
                                <div
                                    key={media.id}
                                    onClick={() => handleMediaClick(media)}
                                    className="relative border border-lightColor/10 dark:border-darkColor/10 rounded-third overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all duration-200 group"
                                >
                                    <Image
                                        width={500}
                                        height={500}
                                        src={media.url}
                                        alt={media.alt}
                                        className="aspect-square object-cover group-hover:scale-105 transition-transform duration-200"
                                    />
                                    <div className="absolute bottom-0 gradient-blur-to-t h-30 bg-gradient-to-t from-darkColor/70 to-transparent rounded-b-third" />
                                    <div className="absolute bottom-0 p-4">
                                        <h2 className="text-sm font-medium text-white">{media.title}</h2>
                                        <p className="text-xs text-neutral-300">{(media.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="">
                            <table className="w-full table-auto border-collapse">
                                <thead>
                                    <tr className="border-b border-lightColor/10 dark:border-darkColor/10">
                                        <th className="text-left text-sm font-medium text-white p-2">Preview</th>
                                        <th className="text-left text-sm font-medium text-white p-2">Title</th>
                                        <th className="text-left text-sm font-medium text-white p-2">Type</th>
                                        <th className="text-left text-sm font-medium text-white p-2">Size</th>
                                        <th className="text-left text-sm font-medium text-white p-2">Uploaded At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dummyMedia.map((media) => (
                                        <tr
                                            key={media.id}
                                            onClick={() => handleMediaClick(media)}
                                            className="border-b border-lightColor/10 dark:border-darkColor/10 hover:bg-lightColor/10 dark:hover:bg-darkColor/10 cursor-pointer"
                                        >
                                            <td className="p-2">
                                                <Image
                                                    width={200}
                                                    height={200}
                                                    src={media.url}
                                                    alt={media.alt}
                                                    className="w-16 h-16 object-cover rounded-md"
                                                />
                                            </td>
                                            <td className="p-2 text-sm text-white">{media.title}</td>
                                            <td className="p-2 text-sm text-white">{media.type}</td>
                                            <td className="p-2 text-sm text-white">{(media.size / 1024).toFixed(2)} KB</td>
                                            <td className="p-2 text-sm text-white">{media.createdAt.toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </Wrapper>

            {/* Dialog untuk menampilkan detail media */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                            {selectedMedia?.title}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedMedia?.alt}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Preview Image */}
                        <div className="relative rounded-lg overflow-hidden bg-neutral-900">
                            {selectedMedia && (
                                <Image
                                    width={800}
                                    height={800}
                                    src={selectedMedia.url}
                                    alt={selectedMedia.alt}
                                    className="w-full h-auto object-contain"
                                />
                            )}
                        </div>

                        {/* Media Details */}
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <FileType className="w-5 h-5 text-neutral-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-neutral-300">Type</p>
                                        <p className="text-base text-white capitalize">{selectedMedia?.type}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <HardDrive className="w-5 h-5 text-neutral-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-neutral-300">Size</p>
                                        <p className="text-base text-white">
                                            {selectedMedia && (selectedMedia.size / 1024).toFixed(2)} KB
                                            {selectedMedia && selectedMedia.size > 1024 * 1024 && 
                                                ` (${(selectedMedia.size / (1024 * 1024)).toFixed(2)} MB)`
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-neutral-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-neutral-300">Uploaded</p>
                                        <p className="text-base text-white">
                                            {selectedMedia?.createdAt.toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-neutral-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-neutral-300">Last Modified</p>
                                        <p className="text-base text-white">
                                            {selectedMedia?.updatedAt.toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 space-y-2">
                                <Button
                                    onClick={handleDownload}
                                    className="w-full"
                                    variant="default"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    className="w-full"
                                    variant="destructive"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}