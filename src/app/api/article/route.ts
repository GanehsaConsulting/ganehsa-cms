import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", data: [] },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search")?.trim() || "";

    const skip = (page - 1) * limit;

    const whereCondition: Prisma.ArticleWhereInput = search
      ? {
          title: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        }
      : {};

    const totalItems = await prisma.article.count({
      where: whereCondition,
    });

    const articles = await prisma.article.findMany({
      where: whereCondition,
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
        thumbnail: { select: { id: true, url: true, title: true, alt: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    return NextResponse.json({
      success: true,
      message: "Success get article data",
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit,
      },
      data: articles,
    });
  } catch (err) {
    console.error("❌ Error fetching articles:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error", data: [] },
      { status: 500 }
    );
  }
}

// ADD NEW ARTIKEL
export async function POST(req: Request) {
  try {
    const user = verifyAuth(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      content,
      slug,
      excerpt,
      categoryId,
      thumbnailId,
      status,
      highlight, // ✅ Tambahkan highlight dari body
    } = body;

    // Validasi input
    if (!title || !content || !slug || !categoryId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Simpan ke database
    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        slug,
        excerpt,
        categoryId: Number(categoryId),
        authorId: Number(user.id),
        status: status || "DRAFT",
        highlight: highlight || false, // ✅ Simpan highlight
        // Thumbnail opsional
        ...(thumbnailId && { thumbnailId: Number(thumbnailId) }),
        // Hapus mediaIds karena tidak butuh gallery
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        author: {
          select: { id: true, name: true, email: true },
        },
        thumbnail: {
          select: { id: true, url: true, title: true, alt: true },
        },
        // Hapus include medias
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
    console.error("Error creating article:", err);

    // if (err.code === "P2002") {
    //   return NextResponse.json(
    //     { success: false, message: "Slug already exists" },
    //     { status: 400 }
    //   );
    // }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
