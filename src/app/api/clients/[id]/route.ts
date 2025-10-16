import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";
import fs from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import crypto from "crypto";

const prisma = new PrismaClient();

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

    const client = await prisma.testimonial.findUnique({ where: { id: clientId } });
    if (!client)
      return NextResponse.json(
        { success: false, message: "Client not found" },
        { status: 404 }
      );

    const clientPhoto = formData.get("clientPhoto") as File | null;
    const companyLogo = formData.get("companyLogo") as File | null;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "clients");
    await fs.mkdir(uploadDir, { recursive: true });

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

    const updatedClient = await prisma.testimonial.update({
      where: { id: clientId },
      data: {
        clientName: (formData.get("clientName") as string) || client.clientName,
        companyName: (formData.get("companyName") as string) || client.companyName,
        clientReview: (formData.get("clientReview") as string) || client.clientReview,
        clientPhoto: clientPhotoUrl || client.clientPhoto,
        companyLogo: companyLogoUrl || client.companyLogo,
      },
    });

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Updated client successfully!",
      data: updatedClient,
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

    const client = await prisma.testimonial.findUnique({ where: { id: clientId } });
    if (!client)
      return NextResponse.json(
        { success: false, message: "Client not found" },
        { status: 404 }
      );

    // Hapus file foto jika ada
    const deleteFile = async (filePath: string | null) => {
      if (!filePath) return;
      const fullPath = path.join(process.cwd(), "public", filePath);
      try {
        await fs.unlink(fullPath);
      } catch {
        console.warn("file not found:", fullPath);
      }
    };
    await deleteFile(client.clientPhoto);
    await deleteFile(client.companyLogo);

    await prisma.testimonial.delete({ where: { id: clientId } });

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Deleted client successfully!",
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
