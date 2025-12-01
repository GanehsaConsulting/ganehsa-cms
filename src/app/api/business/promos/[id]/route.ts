import { verifyAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { getPublicIdFromUrl } from "@/lib/helpers";

// PATCH - Update promo
// PATCH - Update promo
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const promoId = Number(id);

    if (isNaN(promoId)) {
      return NextResponse.json(
        { success: false, message: "Invalid promo ID" },
        { status: 400 }
      );
    }

    const existingPromo = await prisma.promo.findUnique({
      where: { id: promoId },
    });

    if (!existingPromo) {
      return NextResponse.json(
        { success: false, message: "Promo not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const desktopImage = formData.get("desktop_image") as File | null;
    const mobileImage = formData.get("mobile_image") as File | null;
    const url = (formData.get("url") as string) || null;
    const alt = (formData.get("alt") as string) || null;

    let url_desktop = existingPromo.url_desktop;
    let url_mobile = existingPromo.url_mobile;

    // --- DESKTOP IMAGE UPLOAD ---
    if (desktopImage && desktopImage.size > 0) {
      if (existingPromo.url_desktop) {
        const oldId = getPublicIdFromUrl(existingPromo.url_desktop);
        if (oldId) {
          await cloudinary.uploader
            .destroy(`ganesha_cms_promos/desktop/${oldId}`)
            .catch(console.error);
        }
      }

      const buffer = Buffer.from(await desktopImage.arrayBuffer());
      const base64 = `data:${desktopImage.type};base64,${buffer.toString(
        "base64"
      )}`;

      const upload = await cloudinary.uploader.upload(base64, {
        folder: "ganesha_cms_promos/desktop",
        resource_type: "image",
      });

      url_desktop = upload.secure_url;
    }

    // --- MOBILE IMAGE UPLOAD ---
    if (mobileImage && mobileImage.size > 0) {
      if (existingPromo.url_mobile) {
        const oldId = getPublicIdFromUrl(existingPromo.url_mobile);
        if (oldId) {
          await cloudinary.uploader
            .destroy(`ganesha_cms_promos/mobile/${oldId}`)
            .catch(console.error);
        }
      }

      const buffer = Buffer.from(await mobileImage.arrayBuffer());
      const base64 = `data:${mobileImage.type};base64,${buffer.toString(
        "base64"
      )}`;

      const upload = await cloudinary.uploader.upload(base64, {
        folder: "ganesha_cms_promos/mobile",
        resource_type: "image",
      });

      url_mobile = upload.secure_url;
    }

    // --- UPDATE PAYLOAD ---
    // Prisma expects ALL string fields (tidak boleh null)
    const updateData: {
      url_desktop: string;
      url_mobile: string;
      url?: string;
      alt?: string;
    } = {
      url_desktop: url_desktop || existingPromo.url_desktop,
      url_mobile: url_mobile || existingPromo.url_mobile,
    };

    if (url !== null) updateData.url = url;
    if (alt !== null) updateData.alt = alt;

    // --- UPDATE DATABASE ---
    const updatedPromo = await prisma.promo.update({
      where: { id: promoId },
      data: updateData,
    });

    revalidatePath("/admin/promos");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Promo updated successfully",
      data: updatedPromo,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ PATCH promo error:", message);

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// DELETE - Delete promo
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const promoId = parseInt(id);

    if (isNaN(promoId)) {
      return NextResponse.json(
        { success: false, message: "Invalid promo ID" },
        { status: 400 }
      );
    }

    // Check if promo exists
    const existingPromo = await prisma.promo.findUnique({
      where: { id: promoId },
    });

    if (!existingPromo) {
      return NextResponse.json(
        { success: false, message: "Promo not found" },
        { status: 404 }
      );
    }

    // Delete images from Cloudinary
    const url_desktopPublicId = getPublicIdFromUrl(existingPromo.url_desktop);
    const mobilePublicId = getPublicIdFromUrl(existingPromo.url_mobile);

    await Promise.all([
      url_desktopPublicId
        ? cloudinary.uploader
            .destroy(`ganesha_cms_promos/url_desktop/${url_desktopPublicId}`)
            .catch(console.error)
        : Promise.resolve(),
      mobilePublicId
        ? cloudinary.uploader
            .destroy(`ganesha_cms_promos/mobile/${mobilePublicId}`)
            .catch(console.error)
        : Promise.resolve(),
    ]);

    // Delete from database
    await prisma.promo.delete({
      where: { id: promoId },
    });

    revalidatePath("/admin/promos");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Promo deleted successfully",
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ DELETE promo error:", errMsg);
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
  }
}
