"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface WebProjectCardProps {
  image: string;
  title: string;
  category: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function WebProjectCard({
  image,
  title,
  category,
  onEdit,
  onDelete,
}: WebProjectCardProps) {
  return (
    <div className="group bg-darkColor/40 backdrop-blur-xl rounded-lg border border-gray-200/10 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer">
      {/* Gambar */}
      <div className=" relative w-full h-23 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 hover:opacity-100"
        />
      </div>

      {/* Konten */}
      <div className="p-4 flex flex-col justify-between ">
        <div>
          <h3 className="text-sm font-semibold text-white line-clamp-2 mb-1">
            {title.split(" ").length > 4
              ? title.split(" ").slice(0, 4).join(" ") + "..."
              : title}
          </h3>
          <p className="text-xs text-white/60 line-clamp-1">
            {category}
          </p>
        </div>
        
      </div>
    </div>
  );
}
