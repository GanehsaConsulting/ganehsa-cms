import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth"; // helper auth pakai jsonwebtoken

const prisma = new PrismaClient();

// GET ALL CATEGORIES
export async function GET(req: Request) {
  try {
    // 🔒 ambil token dari cookie
    const cookie = req.headers.get("cookie") || "";
    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    const user = verifyAuth(token);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", data: [] },
        { status: 401 }
      );
    }

    // 📂 ambil semua kategori
    const categories = await prisma.categoryArticle.findMany({
      orderBy: { createdAt: "desc" }, // opsional: biar terbaru di atas
    });

    return NextResponse.json(
      {
        success: true,
        message: "Success to fetch all article categories",
        data: categories,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Internal server error", data: [] },
      { status: 500 }
    );
  }
}

// ADD NEW CATEGORY
export async function POST(req: Request) {
  try {
    // 🔒 ambil token dari cookie
    const cookie = req.headers.get("cookie") || "";
    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    const user = verifyAuth(token);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", data: [] },
        { status: 401 }
      );
    }

    // 🔎 ambil body
    const body = await req.json();
    const { name, slug } = body;

    // 🛡️ validasi simple
    if (!name || !slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request: required fields missing",
        },
        { status: 400 }
      );
    }

    // 📝 simpan ke database
    const newArticleCategory = await prisma.categoryArticle.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Success to add new article category",
        data: newArticleCategory,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Internal server error", data: [] },
      { status: 500 }
    );
  }
}
