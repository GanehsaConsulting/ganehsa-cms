import { verifyAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

// GET - Ambil semua promo
export async function GET(req: NextRequest) {
  try {
    const promos = await prisma.promo.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: promos,
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ GET promo error:", errMsg);
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
  }
}

// POST - Buat promo baru dengan upload gambar ke Cloudinary
export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const desktopImage = formData.get("desktop_image") as File;
    const mobileImage = formData.get("mobile_image") as File;
    const url = formData.get("url") as string;
    const alt = formData.get("alt") as string;

    // Validasi input
    if (!desktopImage || !mobileImage || !url || !alt) {
      return NextResponse.json(
        {
          success: false,
          message: "Desktop image, mobile image, URL, dan alt text harus diisi",
        },
        { status: 400 }
      );
    }

    // Upload gambar desktop ke Cloudinary
    const desktopBuffer = Buffer.from(await desktopImage.arrayBuffer());
    const desktopBase64 = `data:${desktopImage.type};base64,${desktopBuffer.toString("base64")}`;
    
    const desktopUpload = await cloudinary.uploader.upload(desktopBase64, {
      folder: "promos/desktop",
      resource_type: "image",
    });

    // Upload gambar mobile ke Cloudinary
    const mobileBuffer = Buffer.from(await mobileImage.arrayBuffer());
    const mobileBase64 = `data:${mobileImage.type};base64,${mobileBuffer.toString("base64")}`;
    
    const mobileUpload = await cloudinary.uploader.upload(mobileBase64, {
      folder: "promos/mobile",
      resource_type: "image",
    });

    // Simpan ke database
    const promo = await prisma.promo.create({
      data: {
        url_dekstop: desktopUpload.secure_url,
        url_mobile: mobileUpload.secure_url,
        url,
        alt,
      },
    });

    revalidatePath("/admin/promos");
    revalidatePath("/");

    return NextResponse.json(
      {
        success: true,
        message: "Promo berhasil dibuat",
        data: promo,
      },
      { status: 201 }
    );
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ POST promo error:", errMsg);
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
  }
}