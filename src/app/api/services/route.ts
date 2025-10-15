import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";

const prisma = new PrismaClient();

// ✅ GET ALL SERVICES
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: {
        packages: {
          include: {
            features: {
              include: { feature: true },
            },
            requirements: {
              include: { requirement: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      message: "Fetched all services",
      data: services,
    });
  } catch (err) {
    console.error("❌ Error fetching services:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error", data: [] },
      { status: 500 }
    );
  }
}

// ✅ ADD NEW SERVICE
export async function POST(req: NextRequest) {
  try {
    const user = verifyAuth(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, slug, description } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: "Name and slug are required" },
        { status: 400 }
      );
    }

    const newService = await prisma.service.create({
      data: { name, slug, description },
    });

    return NextResponse.json({
      success: true,
      message: "Service created successfully",
      data: newService,
    });
  } catch (err) {
    console.error("❌ Error creating service:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
