import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";

const prisma = new PrismaClient();

// GET SINGLE ARTICLE BY ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const articleId = Number(params.id);

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
        thumbnail: { select: { id: true, url: true, title: true, alt: true } },
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Success get article data",
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

// EDIT ARTIKEL
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const articleId = Number(params.id);
    const body = await req.json();
    const { 
      title, 
      content, 
      slug, 
      excerpt, 
      categoryId, 
      thumbnailId,
      status,
      highlight 
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

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Add fields only if they are provided
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (slug !== undefined) updateData.slug = slug;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (categoryId !== undefined) updateData.categoryId = Number(categoryId);
    if (thumbnailId !== undefined) {
      if (thumbnailId === null || thumbnailId === "") {
        updateData.thumbnailId = null;
      } else {
        updateData.thumbnailId = Number(thumbnailId);
      }
    }
    if (status !== undefined) updateData.status = status;
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
  } catch (err: any) {
    console.error("❌ Error updating article:", err);

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

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE ARTIKEL
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const articleId = Number(params.id);

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
  } catch (err: any) {
    console.error("❌ Error deleting article:", err);

    // Handle not found error
    if (err.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}