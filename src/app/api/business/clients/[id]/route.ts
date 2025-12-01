// app/api/testimonial/[id]/route.ts
import { Prisma } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

// 🟢 GET SINGLE CLIENT
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clientId = Number(id);

    const client = await prisma.testimonial.findUnique({
      where: { id: clientId },
      include: { service: true },
    });

    if (!client)
      return NextResponse.json(
        { success: false, message: "Client not found" },
        { status: 404 }
      );

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Get client successfully!",
      data: client,
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "unknown error";
    console.log(errMsg);
    return NextResponse.json({
      status: 500,
      success: false,
      message: errMsg,
    });
  }
}

// 🟠 UPDATE CLIENT
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(req);
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const { id } = await params;
    const clientId = Number(id);
    const formData = await req.formData();

    const client = await prisma.testimonial.findUnique({ 
      where: { id: clientId } 
    });
    
    if (!client)
      return NextResponse.json(
        { success: false, message: "Client not found" },
        { status: 404 }
      );

    const clientPhoto = formData.get("clientPhoto") as File | null;
    const companyLogo = formData.get("companyLogo") as File | null;

    // ✅ Upload ke Cloudinary dengan delete old files
    const uploadToCloudinary = async (
      file: File | null, 
      folder: string, 
      oldPublicId: string | null
    ) => {
      // Delete old file from Cloudinary if exists
      if (oldPublicId) {
        try {
          await cloudinary.uploader.destroy(oldPublicId);
          console.log(`Deleted old Cloudinary file: ${oldPublicId}`);
        } catch (deleteError) {
          console.error("Error deleting old Cloudinary file:", deleteError);
          // Continue with upload even if delete fails
        }
      }

      if (!file) return { url: null, publicId: null };

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Invalid file type: ${file.type}. Allowed: ${allowedTypes.join(', ')}`);
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error(`File too large. Maximum size is 5MB`);
      }

      // Convert file to base64 for Cloudinary
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

      // Upload to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(base64, {
        folder: `ganesha_cms_clients/${folder}`,
        quality: "auto",
        fetch_format: "auto",
      });

      return {
        url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id
      };
    };

    // Upload new files and delete old ones
    const [clientPhotoUpload, companyLogoUpload] = await Promise.all([
      uploadToCloudinary(
        clientPhoto, 
        "client_photos", 
        client.clientPhotoPublicId
      ),
      uploadToCloudinary(
        companyLogo, 
        "company_logos", 
        client.companyLogoPublicId
      )
    ]);

    // Prepare update data
    const updateData: Prisma.TestimonialUpdateInput = {
      clientName: (formData.get("clientName") as string) || client.clientName,
      companyName: (formData.get("companyName") as string) || client.companyName,
      clientReview: (formData.get("clientReview") as string) || client.clientReview,
    };

    // Only update photo fields if new files were uploaded
    if (clientPhoto) {
      updateData.clientPhoto = clientPhotoUpload.url;
      updateData.clientPhotoPublicId = clientPhotoUpload.publicId;
    }

    if (companyLogo) {
      updateData.companyLogo = companyLogoUpload.url;
      updateData.companyLogoPublicId = companyLogoUpload.publicId;
    }

    const updatedClient = await prisma.testimonial.update({
      where: { id: clientId },
      data: updateData,
    });

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Updated client successfully with Cloudinary!",
      data: updatedClient,
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "unknown error";
    console.error("❌ Cloudinary update error:", errMsg);
    return NextResponse.json({
      status: 500,
      success: false,
      message: errMsg,
    });
  }
}

// 🔴 DELETE CLIENT
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(req);
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const { id } = await params;
    const clientId = Number(id);

    const client = await prisma.testimonial.findUnique({ 
      where: { id: clientId } 
    });
    
    if (!client)
      return NextResponse.json(
        { success: false, message: "Client not found" },
        { status: 404 }
      );

    // ✅ Delete files from Cloudinary if they exist
    const deleteFromCloudinary = async (publicId: string | null) => {
      if (!publicId) return;
      
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Successfully deleted from Cloudinary: ${publicId}`);
      } catch (deleteError) {
        console.error("Error deleting from Cloudinary:", deleteError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    };

    // Delete both files from Cloudinary
    await Promise.all([
      deleteFromCloudinary(client.clientPhotoPublicId),
      deleteFromCloudinary(client.companyLogoPublicId)
    ]);

    // Delete from database
    await prisma.testimonial.delete({ 
      where: { id: clientId } 
    });

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Deleted client successfully from Cloudinary and database!",
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "unknown error";
    console.error("❌ Cloudinary delete error:", errMsg);
    return NextResponse.json({
      status: 500,
      success: false,
      message: errMsg,
    });
  }
}