import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";
import { Prisma, Status } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search")?.trim() || "";
    const statusParam = searchParams.get("status")?.trim() || "";

    const skip = (page - 1) * limit;

    // Build where condition with both search and status
    const whereCondition: Prisma.ArticleWhereInput = {
      ...(search && {
        title: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      }),
      ...(statusParam && statusParam !== "all" && {
        status: statusParam.toUpperCase() as Status, // Cast to Status enum
      }),
    };

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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const articleId = Number(id);

    const body = await req.json();
    const {
      title,
      content,
      slug,
      excerpt,
      categoryId,
      thumbnailId,
      status,
      highlight,
    } = body;

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    // Prepare update data with proper Prisma type
    const updateData: Prisma.ArticleUpdateInput = {
      updatedAt: new Date(),
    };

    // Add fields only if they are provided
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (slug !== undefined) updateData.slug = slug;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (categoryId !== undefined) {
      updateData.category = {
        connect: { id: Number(categoryId) },
      };
    }
    if (thumbnailId !== undefined) {
      if (thumbnailId === null || thumbnailId === "") {
        updateData.thumbnail = {
          disconnect: true,
        };
      } else {
        updateData.thumbnail = {
          connect: { id: Number(thumbnailId) },
        };
      }
    }
    if (
      status !== undefined &&
      Object.values(Status).includes(status as Status)
    ) {
      updateData.status = status as Status;
    }
    if (highlight !== undefined) updateData.highlight = Boolean(highlight);

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: updateData,
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
        thumbnail: { select: { id: true, url: true, title: true, alt: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Article updated successfully",
      data: updatedArticle,
    });
  } catch (err) {
    console.error("❌ Error updating article:", err);

    // Handle Prisma errors with proper type checking
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle unique constraint violation (duplicate slug)
      if (err.code === "P2002") {
        return NextResponse.json(
          { success: false, message: "Slug already exists" },
          { status: 400 }
        );
      }

      // Handle not found error
      if (err.code === "P2025") {
        return NextResponse.json(
          { success: false, message: "Article not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE ARTIKEL
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const articleId = Number(id);

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    await prisma.article.delete({
      where: { id: articleId },
    });

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (err) {
    console.error("❌ Error deleting article:", err);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
