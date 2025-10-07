import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth"; // helper auth pakai jsonwebtoken

const prisma = new PrismaClient();

// GET ALL CATEGORIES
export async function GET(req: Request) {
  try {
    const user = verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", data: [] },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 10
    const search = searchParams.get("search")?.trim() || ""
    const skip = (page -1) * limit;


    // 📂 ambil semua kategori + hitung jumlah article
    const categories = await prisma.categoryArticle.findMany({
      orderBy: { createdAt: "asc" }, // 👈 urut dari paling lama
      include: {
        _count: {
          select: { articles: true }, // "articles" = nama relasi di schema Prisma
        },
      },
    });

    // 🎯 mapping biar sesuai goals response
    const formatted = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      articleCount: cat._count.articles,
      date: new Date(cat.createdAt).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Success to fetch all article categories",
        data: formatted,
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

// terapkan pagination dan search 

// ADD NEW CATEGORY
export async function POST(req: Request) {
  try {
    const user = verifyAuth(req);

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
