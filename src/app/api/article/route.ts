import { NextResponse } from "next/server";
import { Prisma, PrismaClient, Status } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const sort = searchParams.get("sort") || "DESC";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ArticleWhereInput = {};

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (status && status !== "all") {
      where.status = status.toUpperCase() as Status;
    }

    // Fetch articles with pagination
    const articles = await prisma.article.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
        thumbnail: { select: { id: true, url: true, title: true, alt: true } },
      },
      orderBy: {
        createdAt: sort.toLowerCase() === "asc" ? "asc" : "desc",
      },
      skip,
      take: limit,
    });

    const totalItems = await prisma.article.count({ where });
    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      success: true,
      data: articles,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
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
