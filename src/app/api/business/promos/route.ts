import { verifyAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

// GET - Get all promos
export async function GET() {
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

// POST - Create new promo with Cloudinary upload
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
    const desktopImage = formData.get("desktop_image") as File | null;
    const mobileImage = formData.get("mobile_image") as File;
    const url = formData.get("url") as string;
    const alt = formData.get("alt") as string;

    // Validation - hanya mobile image yang required
    if (!mobileImage || !url || !alt) {
      return NextResponse.json(
        {
          success: false,
          message: "Mobile image, URL, and alt text are required",
        },
        { status: 400 }
      );
    }

    let desktopUrl = "";
    let mobileUrl = "";

    // Upload mobile image to Cloudinary (required)
    const mobileBuffer = Buffer.from(await mobileImage.arrayBuffer());
    const mobileBase64 = `data:${mobileImage.type};base64,${mobileBuffer.toString("base64")}`;
    
    const mobileUpload = await cloudinary.uploader.upload(mobileBase64, {
      folder: "ganesha_cms_promos/mobile",
      resource_type: "image",
    });
    mobileUrl = mobileUpload.secure_url;

    // Upload desktop image to Cloudinary (optional)
    if (desktopImage && desktopImage.size > 0) {
      const desktopBuffer = Buffer.from(await desktopImage.arrayBuffer());
      const desktopBase64 = `data:${desktopImage.type};base64,${desktopBuffer.toString("base64")}`;
      
      const desktopUpload = await cloudinary.uploader.upload(desktopBase64, {
        folder: "ganesha_cms_promos/desktop",
        resource_type: "image",
      });
      desktopUrl = desktopUpload.secure_url;
    }
    // Jika tidak ada desktop image, biarkan kosong (tidak menggunakan mobile image)

    // Save to database
    const promo = await prisma.promo.create({
      data: {
        url_desktop: desktopUrl, // bisa string kosong jika tidak diupload
        url_mobile: mobileUrl,
        url,
        alt,
      },
    });

    revalidatePath("/admin/promos");
    revalidatePath("/");

    return NextResponse.json(
      {
        success: true,
        message: "Promo created successfully",
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