import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";

const prisma = new PrismaClient();

// EDIT ARTIKEL
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", data: [] },
        { status: 401 }
      );
    }

    const articleId = Number(params.id);
    const body = await req.json();
    const { title, content, thumbnail, slug, excerpt, categoryId } = body;

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(thumbnail && { thumbnail }),
        ...(slug && { slug }),
        ...(excerpt && { excerpt }),
        ...(categoryId && { categoryId: Number(categoryId) }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Article updated successfully",
      data: updatedArticle,
    });
  } catch (err) {
    console.error(err);
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
    const user = verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", data: [] },
        { status: 401 }
      );
    }
    const articleId = Number(params.id);

    await prisma.article.delete({
      where: { id: articleId },
    });

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
