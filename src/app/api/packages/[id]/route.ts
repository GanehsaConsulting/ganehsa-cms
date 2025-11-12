import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calculateOriginalPrice } from "@/lib/helpers";

interface PackageFeature {
  feature: string;
  status: boolean;
}

interface UpdatePackageBody {
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const packageIdInt = Number(id);

    if (isNaN(packageIdInt))
      return NextResponse.json(
        { success: false, message: "Invalid package ID" },
        { status: 400 }
      );

    const pkg = await prisma.package.findUnique({
      where: { id: packageIdInt },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(req);
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const { id } = await params;
    const packageIdInt = Number(id);

    if (isNaN(packageIdInt))
      return NextResponse.json(
        { success: false, message: "Invalid package ID" },
        { status: 400 }
      );

    const body: UpdatePackageBody = await req.json();
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

    // Validate service exists if serviceId is provided
    if (serviceId) {
      const serviceExists = await prisma.service.findUnique({
        where: { id: serviceId },
      });
      if (!serviceExists) {
        return NextResponse.json(
          { success: false, message: "Service not found" },
          { status: 404 }
        );
      }
    }

    // Check if package exists
    const existing = await prisma.package.findUnique({
      where: { id: packageIdInt },
    });
    
    if (!existing)
      return NextResponse.json(
        { success: false, message: "Package not found" },
        { status: 404 }
      );

    // Prepare update data
    const updateData: {
      serviceId?: number;
      type?: string;
      highlight?: boolean;
      price?: number;
      priceOriginal?: number;
      discount?: number;
      link?: string;
    } = {};

    if (serviceId !== undefined) updateData.serviceId = serviceId;
    if (type !== undefined) updateData.type = type;
    if (highlight !== undefined) updateData.highlight = highlight;
    if (link !== undefined) updateData.link = link;
    
    // Handle price and discount calculation
    const finalPrice = price !== undefined ? price : existing.price;
    const finalDiscount = discount !== undefined ? discount : existing.discount;
    
    if (price !== undefined) updateData.price = price;
    if (discount !== undefined) updateData.discount = discount;
    
    // Calculate original price
    updateData.priceOriginal = calculateOriginalPrice(finalPrice, finalDiscount);

    // Perform transaction
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update package basic info
      const updatedPackage = await tx.package.update({ 
        where: { id: packageIdInt }, 
        data: updateData 
      });

      // 2. Update features if provided
      if (features && Array.isArray(features)) {
        // Delete existing package features
        await tx.packageFeature.deleteMany({
          where: { packageId: packageIdInt },
        });

        // Insert new features
        for (const f of features) {
          if (!f.feature || f.feature.trim() === '') continue;

          const feature = await tx.feature.upsert({
            where: { name: f.feature.trim() },
            create: { name: f.feature.trim() },
            update: {},
          });

          await tx.packageFeature.create({
            data: {
              packageId: packageIdInt,
              featureId: feature.id,
              status: f.status !== undefined ? f.status : true,
            },
          });
        }
      }

      // 3. Update requirements if provided
      if (requirements && Array.isArray(requirements)) {
        // Delete existing package requirements
        await tx.packageRequirement.deleteMany({
          where: { packageId: packageIdInt },
        });

        // Insert new requirements
        for (const r of requirements) {
          if (!r || r.trim() === '') continue;

          const req = await tx.requirement.upsert({
            where: { name: r.trim() },
            create: { name: r.trim() },
            update: {},
          });

          await tx.packageRequirement.create({
            data: { 
              packageId: packageIdInt, 
              requirementId: req.id 
            },
          });
        }
      }

      // 4. Fetch final updated package with relations
      return await tx.package.findUnique({
        where: { id: packageIdInt },
        include: {
          service: { 
            select: { 
              id: true, 
              name: true, 
              slug: true 
            } 
          },
          features: { 
            include: { 
              feature: true 
            } 
          },
          requirements: { 
            include: { 
              requirement: true 
            } 
          },
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
    
    // More detailed error logging
    if (err instanceof Error) {
      console.error("Error name:", err.name);
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Server error",
        error: process.env.NODE_ENV === 'development' ? String(err) : undefined
      },
      { status: 500 }
    );
  }
}

// ===================== DELETE =====================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(req);
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const { id } = await params;
    const packageIdInt = Number(id);

    if (isNaN(packageIdInt))
      return NextResponse.json(
        { success: false, message: "Invalid package ID" },
        { status: 400 }
      );

    await prisma.package.delete({ where: { id: packageIdInt } });

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