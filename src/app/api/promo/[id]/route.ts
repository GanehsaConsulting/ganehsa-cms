import { verifyAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

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
    const promoId = parseInt(id);

    if (isNaN(promoId)) {
      return NextResponse.json(
        { success: false, message: "Invalid promo ID" },
        { status: 400 }
      );
    }

    // Cek apakah promo ada
    const existingPromo = await prisma.promo.findUnique({
      where: { id: promoId },
    });

    if (!existingPromo) {
      return NextResponse.json(
        { success: false, message: "Promo tidak ditemukan" },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const desktopImage = formData.get("desktop_image") as File | null;
    const mobileImage = formData.get("mobile_image") as File | null;
    const url = formData.get("url") as string | null;
    const alt = formData.get("alt") as string | null;

    let url_dekstop = existingPromo.url_dekstop;
    let url_mobile = existingPromo.url_mobile;

    // Upload gambar desktop baru jika ada
    if (desktopImage && desktopImage.size > 0) {
      // Hapus gambar lama dari Cloudinary
      const oldDesktopPublicId = existingPromo.url_dekstop.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(`promos/desktop/${oldDesktopPublicId}`).catch(console.error);

      // Upload gambar baru
      const desktopBuffer = Buffer.from(await desktopImage.arrayBuffer());
      const desktopBase64 = `data:${desktopImage.type};base64,${desktopBuffer.toString("base64")}`;
      
      const desktopUpload = await cloudinary.uploader.upload(desktopBase64, {
        folder: "promos/desktop",
        resource_type: "image",
      });

      url_dekstop = desktopUpload.secure_url;
    }

    // Upload gambar mobile baru jika ada
    if (mobileImage && mobileImage.size > 0) {
      // Hapus gambar lama dari Cloudinary
      const oldMobilePublicId = existingPromo.url_mobile.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(`promos/mobile/${oldMobilePublicId}`).catch(console.error);

      // Upload gambar baru
      const mobileBuffer = Buffer.from(await mobileImage.arrayBuffer());
      const mobileBase64 = `data:${mobileImage.type};base64,${mobileBuffer.toString("base64")}`;
      
      const mobileUpload = await cloudinary.uploader.upload(mobileBase64, {
        folder: "promos/mobile",
        resource_type: "image",
      });

      url_mobile = mobileUpload.secure_url;
    }

    // Update database
    const updatedPromo = await prisma.promo.update({
      where: { id: promoId },
      data: {
        url_dekstop,
        url_mobile,
        ...(url && { url }),
        ...(alt && { alt }),
      },
    });

    revalidatePath("/admin/promos");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Promo berhasil diupdate",
      data: updatedPromo,
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ PATCH promo error:", errMsg);
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
  }
}

// DELETE - Hapus promo
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

    // Cek apakah promo ada
    const existingPromo = await prisma.promo.findUnique({
      where: { id: promoId },
    });

    if (!existingPromo) {
      return NextResponse.json(
        { success: false, message: "Promo tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus gambar dari Cloudinary
    const desktopPublicId = existingPromo.url_dekstop.split("/").slice(-2).join("/").split(".")[0];
    const mobilePublicId = existingPromo.url_mobile.split("/").slice(-2).join("/").split(".")[0];

    await Promise.all([
      cloudinary.uploader.destroy(`promos/desktop/${desktopPublicId}`).catch(console.error),
      cloudinary.uploader.destroy(`promos/mobile/${mobilePublicId}`).catch(console.error),
    ]);

    // Hapus dari database
    await prisma.promo.delete({
      where: { id: promoId },
    });

    revalidatePath("/admin/promos");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Promo berhasil dihapus",
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