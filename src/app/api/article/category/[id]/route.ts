import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";

const prisma = new PrismaClient();

// ✏️ UPDATE CATEGORY by ID
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

    const body = await req.json();
    const { name, slug } = body;

    // kalau semua kosong, error
    if (!name && !slug) {
      return NextResponse.json(
        { success: false, message: "At least one field (name or slug) is required" },
        { status: 400 }
      );
    }

    // build data update secara dinamis
    const data: any = {};
    if (name) data.name = name;
    if (slug) data.slug = slug;

    const updatedCategory = await prisma.categoryArticle.update({
      where: { id: Number(params.id) },
      data,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Success to update article category",
        data: updatedCategory,
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

// 🗑️ DELETE CATEGORY by ID
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

    await prisma.categoryArticle.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Success to delete article category",
        data: null,
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
