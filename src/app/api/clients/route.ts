import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

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

    // ✅ Upload ke Filess.io
    const saveFile = async (file: File | null) => {
      if (!file) return null;

      const uploadForm = new FormData();
      uploadForm.append("file", file);

      const res = await fetch("https://api.filess.io/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.FILESS_API_KEY}`,
        },
        body: uploadForm,
      });

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(`Filess upload failed: ${errMsg}`);
      }

      const data = await res.json();
      return data.url;
    };

    const clientPhotoUrl = await saveFile(clientPhoto);
    const companyLogoUrl = await saveFile(companyLogo);

    // ✅ Simpan ke DB
    const newClient = await prisma.testimonial.create({
      data: {
        clientName,
        companyName,
        clientReview,
        serviceId,
        clientPhoto: clientPhotoUrl,
        companyLogo: companyLogoUrl,
      },
    });

    revalidatePath("/dashboard/clients");

    return NextResponse.json({
      status: 201,
      success: true,
      message: "Added new client information successfully!",
      data: newClient,
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "unknown error";
    console.error("❌ Upload error:", errMsg);
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
    const where: any = {};
    
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
