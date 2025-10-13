import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";
import fs from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import crypto from "crypto";

const prisma = new PrismaClient();

// ======================
// GET MEDIAS (with pagination + search)
// ======================
export async function GET(req: NextRequest) {
  try {
    // const user = await verifyAuth(req);
    // if (!user) {
    //   return NextResponse.json(
    //     { success: false, message: "Unauthorized", data: [] },
    //     { status: 401 }
    //   );
    // }

    // Parse query parameters from the URL
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Query database with search and pagination
    const [medias, total] = await Promise.all([
      prisma.media.findMany({
        where: search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { alt: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.media.count({
        where: search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { alt: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      message: "Get medias data successfully",
      data: medias,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Internal server error", data: [] },
      { status: 500 }
    );
  }
}

// ======================
// UPLOAD IMAGE
// ======================
export async function POST(req: Request) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const type = formData.get("type") as string;

    // Validasi dasar
    if (!file || !title || !type) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate nama acak & path penyimpanan
    const fileExt = path.extname(file.name);
    const randomName = crypto.randomBytes(16).toString("hex") + fileExt;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, randomName);

    await fs.mkdir(uploadDir, { recursive: true });

    // Simpan file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    // Generate metadata
    const url = `/uploads/${randomName}`;
    const alt = title;
    const size = file.size;
    const uploadedById = Number(user.id);

    // Simpan ke database
    const media = await prisma.media.create({
      data: {
        title,
        type,
        alt,
        url,
        size,
        uploadedById,
      },
    });

    revalidatePath("/");

    return NextResponse.json({
      status: 201,
      success: true,
      message: "Image uploaded successfully",
      data: media,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
