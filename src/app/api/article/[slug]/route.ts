import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";
import { Prisma, Status } from "@prisma/client";
import prisma from "@/lib/prisma";

// GET BY SLUG
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const articleSlug = slug;

    console.log("Mencari artikel dengan slug:", articleSlug);

    // First, check if slug is unique in the database
    const articleCount = await prisma.article.count({
      where: { slug: articleSlug },
    });

    console.log(`Jumlah artikel dengan slug ${articleSlug}:`, articleCount);

    if (articleCount > 1) {
      console.warn(`⚠️ Peringatan: Ada ${articleCount} artikel dengan slug yang sama: ${articleSlug}`);
    }

    // Use findFirst instead of findUnique since slug might not be unique
    const article = await prisma.article.findFirst({
      where: { 
        slug: articleSlug,
        // Add status filter if you only want published articles
        // status: "PUBLISHED"
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
        thumbnail: { select: { id: true, url: true, title: true, alt: true } },
      },
    });

    console.log("Artikel ditemukan:", article);

    if (!article) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (err) {
    console.error("❌ Error fetching article:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const articleSlug = slug;

    const body = await req.json();
    const {
      title,
      content,
      slug: newSlug,
      excerpt,
      categoryId,
      thumbnailId,
      status,
      highlight,
    } = body;

    // Check if article exists
    const existingArticle = await prisma.article.findFirst({
      where: { slug: articleSlug },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    // Get the article ID to use for update
    const articleId = existingArticle.id;

    // Prepare update data with proper Prisma type
    const updateData: Prisma.ArticleUpdateInput = {
      updatedAt: new Date(),
    };

    // Add fields only if they are provided
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (newSlug !== undefined) updateData.slug = newSlug;
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
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const articleSlug = slug;

    // Check if article exists
    const existingArticle = await prisma.article.findFirst({
      where: { slug: articleSlug },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    // Get the article ID to use for delete
    const articleId = existingArticle.id;

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