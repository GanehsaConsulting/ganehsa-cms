import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calculateOriginalPrice } from "@/lib/helpers";

interface PackageFeature {
  feature: string;
  status: boolean;
}

interface UpdatePackageRequest {
  serviceId?: number;
  type?: string;
  highlight?: boolean;
  price?: number;
  discount?: number;
  link?: string;
  features?: PackageFeature[];
  requirements?: string[];
}

// ===================== GET BY ID =====================
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id))
      return NextResponse.json(
        { success: false, message: "Invalid package ID" },
        { status: 400 }
      );

    const pkg = await prisma.package.findUnique({
      where: { id },
      include: {
        service: { select: { id: true, name: true, slug: true } },
        features: {
          include: { feature: true },
          orderBy: { feature: { name: "asc" } },
        },
        requirements: {
          include: { requirement: true },
          orderBy: { requirement: { name: "asc" } },
        },
      },
    });

    if (!pkg)
      return NextResponse.json(
        { success: false, message: "Package not found" },
        { status: 404 }
      );

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Package fetched successfully",
      data: {
        ...pkg,
        features: pkg.features.map((f) => ({
          feature: f.feature.name,
          status: f.status,
        })),
        requirements: pkg.requirements.map((r) => r.requirement.name),
      },
    });
  } catch (err) {
    console.error("GET /api/packages/[id] error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// ===================== PATCH (UPDATE) =====================
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(req);
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const id = Number(params.id);
    if (isNaN(id))
      return NextResponse.json(
        { success: false, message: "Invalid package ID" },
        { status: 400 }
      );

    const body: UpdatePackageRequest = await req.json();
    const {
      serviceId,
      type,
      highlight,
      price,
      discount,
      link,
      features,
      requirements,
    } = body;

    const existing = await prisma.package.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json(
        { success: false, message: "Package not found" },
        { status: 404 }
      );

    const updateData: any = {};
    if (serviceId) updateData.serviceId = serviceId;
    if (type) updateData.type = type;
    if (highlight !== undefined) updateData.highlight = highlight;
    if (price !== undefined) updateData.price = price;
    if (discount !== undefined) {
      updateData.discount = discount;
      updateData.priceOriginal = await calculateOriginalPrice(
        price ?? existing.price,
        discount
      );
    }
    if (link) updateData.link = link;

    const updated = await prisma.$transaction(async (tx) => {
      const pkg = await tx.package.update({ where: { id }, data: updateData });

      if (features) {
        await tx.packageFeature.deleteMany({ where: { packageId: id } });
        for (const f of features) {
          const feature = await tx.feature.upsert({
            where: { name: f.feature },
            create: { name: f.feature },
            update: {},
          });
          await tx.packageFeature.create({
            data: { packageId: id, featureId: feature.id, status: f.status },
          });
        }
      }

      if (requirements) {
        await tx.packageRequirement.deleteMany({ where: { packageId: id } });
        for (const r of requirements) {
          const req = await tx.requirement.upsert({
            where: { name: r },
            create: { name: r },
            update: {},
          });
          await tx.packageRequirement.create({
            data: { packageId: id, requirementId: req.id },
          });
        }
      }

      return await tx.package.findUnique({
        where: { id },
        include: {
          service: { select: { id: true, name: true, slug: true } },
          features: { include: { feature: true } },
          requirements: { include: { requirement: true } },
        },
      });
    });

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Package updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("PATCH /api/packages/[id] error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// ===================== DELETE =====================
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(req);
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const id = Number(params.id);
    if (isNaN(id))
      return NextResponse.json(
        { success: false, message: "Invalid package ID" },
        { status: 400 }
      );

    await prisma.package.delete({ where: { id } });

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Package deleted successfully",
      data: { id },
    });
  } catch (err) {
    console.error("DELETE /api/packages/[id] error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
