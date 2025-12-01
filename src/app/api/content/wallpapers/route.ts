import { verifyAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

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
    const name = formData.get("name") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File is required" },
        { status: 400 }
      );
    }

    // Validate file type (hanya image)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "File type not allowed. Only images are permitted." },
        { status: 400 }
      );
    }

    // Validate file size
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "File size too large. Maximum 5MB." },
        { status: 400 }
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64, {
      folder: "ganesha_cms_wallpapers",
      resource_type: "image",
      quality: "auto",
      fetch_format: "auto",
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });

    // Hapus wallpaper lama jika ada
    const existingWallpaper = await prisma.wallpaper.findUnique({
      where: { userId: Number(user.id) }
    });

    if (existingWallpaper && existingWallpaper.publicId) {
      // Hapus dari Cloudinary
      await cloudinary.uploader.destroy(existingWallpaper.publicId);
      
      // Hapus dari database
      await prisma.wallpaper.delete({
        where: { id: existingWallpaper.id }
      });
    }

    // Simpan wallpaper baru
    const wallpaper = await prisma.wallpaper.create({
      data: {
        url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id,
        name: name || `Wallpaper ${user.name}`,
        userId: Number(user.id)
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/settings");

    return NextResponse.json({
      status: 201,
      success: true,
      message: "Wallpaper uploaded successfully",
      data: wallpaper,
    });

  } catch (err) {
    console.error("WALLPAPER UPLOAD ERROR:", err);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error",
        error: err instanceof Error ? err.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const wallpaper = await prisma.wallpaper.findUnique({
      where: { userId: Number(user.id) }
    });

    return NextResponse.json({
      success: true,
      message: "Wallpaper retrieved successfully",
      data: wallpaper,
    });

  } catch (err) {
    console.error("GET WALLPAPER ERROR:", err);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error",
        error: err instanceof Error ? err.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Cari wallpaper user
    const wallpaper = await prisma.wallpaper.findUnique({
      where: { userId: Number(user.id) }
    });

    if (!wallpaper) {
      return NextResponse.json(
        { success: false, message: "Wallpaper not found" },
        { status: 404 }
      );
    }

    // Hapus dari Cloudinary
    if (wallpaper.publicId) {
      await cloudinary.uploader.destroy(wallpaper.publicId);
    }

    // Hapus dari database
    await prisma.wallpaper.delete({
      where: { id: wallpaper.id }
    });

    revalidatePath("/dashboard");
    revalidatePath("/settings");

    return NextResponse.json({
      success: true,
      message: "Wallpaper deleted successfully",
    });

  } catch (err) {
    console.error("DELETE WALLPAPER ERROR:", err);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error",
        error: err instanceof Error ? err.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}