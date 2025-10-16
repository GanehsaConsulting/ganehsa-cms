import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";

const prisma = new PrismaClient();

// ✅ GET DETAIL SERVICE
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const serviceIdInt = Number(id);

    const service = await prisma.service.findUnique({
      where: { id: serviceIdInt },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyAuth(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const serviceIdInt = Number(id);
    const body = await req.json();

    // validasi input berdasarkan field yang diizinkan
    const dataToUpdate: Partial<Prisma.ServiceUpdateInput> = {};

    if (typeof body.name === "string") dataToUpdate.name = body.name;
    if (typeof body.slug === "string") dataToUpdate.slug = body.slug;
    if (typeof body.description === "string")
      dataToUpdate.description = body.description;

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updatedService = await prisma.service.update({
      where: { id: serviceIdInt },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyAuth(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const serviceIdInt = Number(id);

    const deleted = await prisma.service.delete({
      where: { id: serviceIdInt },
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
