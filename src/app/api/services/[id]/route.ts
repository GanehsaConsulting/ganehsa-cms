import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";

const prisma = new PrismaClient();

// ✅ GET DETAIL SERVICE
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        packages: {
          include: {
            features: { include: { feature: true } },
            requirements: { include: { requirement: true } },
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Fetched service detail",
      data: service,
    });
  } catch (err) {
    console.error("❌ Error fetching service detail:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ PATCH (Partial Update) SERVICE
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyAuth(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = parseInt(params.id);
    const body = await req.json();

    // validasi input (biarkan kosong jika tidak diupdate)
    const dataToUpdate: Record<string, any> = {};
    if (body.name !== undefined) dataToUpdate.name = body.name;
    if (body.slug !== undefined) dataToUpdate.slug = body.slug;
    if (body.description !== undefined) dataToUpdate.description = body.description;

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (err) {
    console.error("❌ Error updating service:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ DELETE SERVICE
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyAuth(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = parseInt(params.id);

    const deleted = await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
      data: deleted,
    });
  } catch (err) {
    console.error("❌ Error deleting service:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
