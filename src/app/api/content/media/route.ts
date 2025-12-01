import { verifyAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { getCachedMedias } from "@/lib/cache/media.cache";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: Prisma.MediaWhereInput = search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              alt: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : {};

    const { medias, total } = await getCachedMedias(where, skip, limit);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      message: "Get medias data successfully",
      data: medias,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (err) {
    console.error("MEDIA ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error", data: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const type = formData.get("type") as string;
    const alt = (formData.get("alt") as string) || title;

    if (!file || !title || !type) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/quicktime",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "File type not allowed" },
        { status: 400 }
      );
    }

    // Validate file size
    const maxSize = file.type.startsWith("video/")
      ? 50 * 1024 * 1024
      : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "File size too large" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Determine resource type for Cloudinary
    let resourceType: "image" | "video" | "raw" = "image";
    if (file.type.startsWith("video/")) {
      resourceType = "video";
    } else if (file.type === "application/pdf") {
      resourceType = "raw";
    }

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64, {
      folder: "cms_media",
      resource_type: resourceType,
      quality: "auto",
      fetch_format: "auto",
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });

    // Save metadata in database
    const media = await prisma.media.create({
      data: {
        title,
        type: file.type,
        alt,
        url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id, // This will work after migration
        size: file.size,
        uploadedById: Number(user.id),
      },
    });

    revalidatePath("/dashboard/media");
    revalidatePath("/");

    return NextResponse.json({
      status: 201,
      success: true,
      message: "File uploaded to Cloudinary successfully",
      data: media,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
