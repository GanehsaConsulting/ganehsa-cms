import { verifyAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

// Helper function to extract public ID from Cloudinary URL
function getPublicIdFromUrl(url: string): string {
  try {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return filename.split('.')[0];
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "unknown error"
    console.error('Error extracting public ID from URL:', errMsg);
    return '';
  }
}

// Type for promo update data
interface PromoUpdateData {
  url_desktop: string;
  url_mobile: string;
  url?: string;
  alt?: string;
  isPopup?: boolean;
}

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

    const formData = await req.formData();
    const desktopImage = formData.get("desktop_image") as File | null;
    const mobileImage = formData.get("mobile_image") as File | null;
    const url = formData.get("url") as string | null;
    const alt = formData.get("alt") as string | null;
    const isPopup = formData.get("isPopup") as string | null;

    let url_desktop = existingPromo.url_desktop;
    let url_mobile = existingPromo.url_mobile;

    // Upload new desktop image if provided
    if (desktopImage && desktopImage.size > 0) {
      // Delete old image from Cloudinary jika ada
      if (existingPromo.url_desktop) {
        const oldDesktopPublicId = getPublicIdFromUrl(existingPromo.url_desktop);
        if (oldDesktopPublicId) {
          await cloudinary.uploader.destroy(`ganesha_cms_promos/desktop/${oldDesktopPublicId}`).catch(console.error);
        }
      }

      // Upload new image
      const desktopBuffer = Buffer.from(await desktopImage.arrayBuffer());
      const desktopBase64 = `data:${desktopImage.type};base64,${desktopBuffer.toString("base64")}`;
      
      const desktopUpload = await cloudinary.uploader.upload(desktopBase64, {
        folder: "ganesha_cms_promos/desktop",
        resource_type: "image",
      });

      url_desktop = desktopUpload.secure_url;
    }
    // Jika desktopImage tidak disediakan, biarkan url_desktop tetap (tidak diubah)

    // Upload new mobile image if provided
    if (mobileImage && mobileImage.size > 0) {
      // Delete old image from Cloudinary
      const oldMobilePublicId = getPublicIdFromUrl(existingPromo.url_mobile);
      if (oldMobilePublicId) {
        await cloudinary.uploader.destroy(`ganesha_cms_promos/mobile/${oldMobilePublicId}`).catch(console.error);
      }

      // Upload new image
      const mobileBuffer = Buffer.from(await mobileImage.arrayBuffer());
      const mobileBase64 = `data:${mobileImage.type};base64,${mobileBuffer.toString("base64")}`;
      
      const mobileUpload = await cloudinary.uploader.upload(mobileBase64, {
        folder: "ganesha_cms_promos/mobile",
        resource_type: "image",
      });

      url_mobile = mobileUpload.secure_url;
    }

    // Prepare update data with proper typing
    const updateData: any = {
      url_desktop,
      url_mobile,
    };

    // Add optional fields if provided
    if (url) {
      updateData.url = url;
    }
    if (alt) {
      updateData.alt = alt;
    }
    if (isPopup !== null) {
      updateData.isPopup = isPopup === "true";
    }

    // Update database
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
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ PATCH promo error:", errMsg);
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
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
      url_desktopPublicId ? cloudinary.uploader.destroy(`ganesha_cms_promos/url_desktop/${url_desktopPublicId}`).catch(console.error) : Promise.resolve(),
      mobilePublicId ? cloudinary.uploader.destroy(`ganesha_cms_promos/mobile/${mobilePublicId}`).catch(console.error) : Promise.resolve(),
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