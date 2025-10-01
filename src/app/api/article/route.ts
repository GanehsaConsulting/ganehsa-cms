import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth"; // helper auth pakai jsonwebtoken

const prisma = new PrismaClient();

// GET SEMUA ARTIKEL
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

    // 📂 ambil semua artikel + relasi author & category
    const articlesData = await prisma.article.findMany({
      include: {
        author: {   // relasi user
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: { // relasi category
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!articlesData || articlesData.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Article data not found",
        data: [],
      });
    }

    return NextResponse.json({
      success: true,
      message: "Success get article data",
      data: articlesData,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Internal server error", data: [] },
      { status: 500 }
    );
  }
}


// TAMBAH ARTIKEL
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
    const { title, content, thumbnail, slug, excerpt, categoryId } = body;

    // 🛡️ validasi simple
    if (!title || !content || !slug || !categoryId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request: required fields missing",
        },
        { status: 400 }
      );
    }

    // 📝 simpan ke database
    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        thumbnail,
        slug,
        excerpt,
        categoryId: Number(categoryId), // pastikan jadi number
        authorId: Number(user.id), // convert string -> number
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Success to add new article",
        data: newArticle,
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
