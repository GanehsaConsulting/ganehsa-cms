import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET ALL CATEGORIES WITH PAGINATION & SEARCH
export async function GET(req: Request) {
  try {
    // const user = verifyAuth(req);

    // if (!user) {
    //   return NextResponse.json(
    //     { success: false, message: "Unauthorized", data: [] },
    //     { status: 401 }
    //   );
    // }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search")?.trim() || "";
    const skip = (page - 1) * limit;

    // Build where condition for search
    const whereCondition = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { slug: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    // Get total count for pagination
    const totalCount = await prisma.categoryArticle.count({
      where: whereCondition,
    });

    // Fetch categories with pagination
    const categories = await prisma.categoryArticle.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    // Format response
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

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json(
      {
        success: true,
        message: "Success to fetch all article categories",
        data: formatted,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
        },
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
    const user = verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", data: [] },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request: required fields missing",
        },
        { status: 400 }
      );
    }

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