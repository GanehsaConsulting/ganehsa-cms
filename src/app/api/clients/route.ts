// app/api/testimonial/route.ts
import { Prisma, PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const formData = await req.formData();
    const clientName = formData.get("clientName") as string;
    const companyName = formData.get("companyName") as string | null;
    const clientReview = formData.get("clientReview") as string;
    const serviceId = Number(formData.get("serviceId"));
    const clientPhoto = formData.get("clientPhoto") as File | null;
    const companyLogo = formData.get("companyLogo") as File | null;

    // ✅ Upload ke Cloudinary
    const uploadToCloudinary = async (file: File | null, folder: string) => {
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

    // Upload both files
    const [clientPhotoUpload, companyLogoUpload] = await Promise.all([
      uploadToCloudinary(clientPhoto, "client_photos"),
      uploadToCloudinary(companyLogo, "company_logos")
    ]);

    // ✅ Simpan ke DB dengan publicId
    const newClient = await prisma.testimonial.create({
      data: {
        clientName,
        companyName,
        clientReview,
        serviceId,
        clientPhoto: clientPhotoUpload.url,
        clientPhotoPublicId: clientPhotoUpload.publicId,
        companyLogo: companyLogoUpload.url,
        companyLogoPublicId: companyLogoUpload.publicId,
      },
    });

    revalidatePath("/dashboard/clients");

    return NextResponse.json({
      status: 201,
      success: true,
      message: "Added new client information successfully with Cloudinary!",
      data: newClient,
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "unknown error";
    console.error("❌ Cloudinary upload error:", errMsg);
    return NextResponse.json({
      status: 500,
      success: false,
      message: errMsg,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const serviceFilter = searchParams.get('serviceFilter') || 'All Services';

    const skip = (page - 1) * limit;

    // Build where condition
    const where: Prisma.TestimonialWhereInput = {};
    
    if (search) {
      where.OR = [
        { clientName: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { clientReview: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (serviceFilter && serviceFilter !== 'All Services') {
      where.serviceId = parseInt(serviceFilter);
    }

    const [clients, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        include: { service: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.testimonial.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Get clients information successfully!",
      data: clients,
      total,
      totalPages,
      page,
      limit,
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