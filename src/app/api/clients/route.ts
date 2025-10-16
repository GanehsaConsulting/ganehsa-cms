import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";
import fs from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import crypto from "crypto";

const prisma = new PrismaClient();

// 🟢 GET ALL CLIENTS
export async function GET() {
  try {
    const clients = await prisma.testimonial.findMany({
      include: { service: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Get clients information successfully!",
      data: clients,
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

// 🟢 CREATE NEW CLIENT (with file upload)
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

    // 📁 Folder upload
    const uploadDir = path.join(process.cwd(), "public", "uploads", "clients");
    await fs.mkdir(uploadDir, { recursive: true });

    // 📸 Upload file jika ada
    const saveFile = async (file: File | null) => {
      if (!file) return null;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = path.extname(file.name);
      const fileName = `${crypto.randomBytes(16).toString("hex")}${ext}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);
      return `/uploads/clients/${fileName}`;
    };

    const clientPhotoUrl = await saveFile(clientPhoto);
    const companyLogoUrl = await saveFile(companyLogo);

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
    console.log(errMsg);
    return NextResponse.json({
      status: 500,
      success: false,
      message: errMsg,
    });
  }
}
