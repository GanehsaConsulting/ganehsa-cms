import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calculateOriginalPrice, processFeatures, processRequirements } from "@/lib/helpers";

export interface PackageFeature {
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
// Temporary debugging endpoint - remove after fixing
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 GET package request for:", await params);
    
    const { id } = await params;
    const packageIdInt = Number(id);

    if (isNaN(packageIdInt)) {
      return NextResponse.json(
        { success: false, message: "Invalid package ID" },
        { status: 400 }
      );
    }

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

    console.log("📦 Found package:", pkg ? `ID: ${pkg.id}` : "Not found");

    if (!pkg) {
      return NextResponse.json(
        { success: false, message: "Package not found" },
        { status: 404 }
      );
    }

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
    console.error("❌ GET /api/packages/[id] error:", err);
    
    // More detailed error information
    return NextResponse.json(
      { 
        success: false, 
        message: "Server error",
        error: process.env.NODE_ENV === 'development' ? String(err) : undefined,
        stack: process.env.NODE_ENV === 'development' ? (err as Error).stack : undefined
      },
      { status: 500 }
    );
  }
}

// ===================== PATCH (UPDATE) - OPTIMIZED =====================
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔄 Starting optimized PATCH operation for package");
    
    const user = await verifyAuth(req);
    if (!user) {
      console.log("❌ Unauthorized access attempt");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const packageIdInt = Number(id);
    console.log("📦 Package ID to update:", packageIdInt);

    if (isNaN(packageIdInt)) {
      console.log("❌ Invalid package ID:", id);
      return NextResponse.json(
        { success: false, message: "Invalid package ID" },
        { status: 400 }
      );
    }

    const body: UpdatePackageBody = await req.json();
    const {
      serviceId,
      type,
      highlight,
      price,
      discount,
      link,
      features = [],
      requirements = [],
    } = body;

    console.log("📨 Received update data:", {
      serviceId,
      type,
      highlight,
      price,
      discount,
      link,
      featuresCount: features.length,
      requirementsCount: requirements.length
    });

    // Enhanced validation
    if (serviceId !== undefined) {
      if (typeof serviceId !== 'number' || serviceId <= 0) {
        return NextResponse.json(
          { success: false, message: "Invalid service ID" },
          { status: 400 }
        );
      }

      // Validate service exists
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

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return NextResponse.json(
        { success: false, message: "Invalid price" },
        { status: 400 }
      );
    }

    if (discount !== undefined && (typeof discount !== 'number' || discount < 0 || discount > 100)) {
      return NextResponse.json(
        { success: false, message: "Discount must be between 0 and 100" },
        { status: 400 }
      );
    }

    // Check if package exists
    const existingPackage = await prisma.package.findUnique({
      where: { id: packageIdInt },
    });
    
    if (!existingPackage) {
      console.log("❌ Package not found:", packageIdInt);
      return NextResponse.json(
        { success: false, message: "Package not found" },
        { status: 404 }
      );
    }

    console.log("✅ Package found, preparing update...");

    // Prepare update data - hanya field yang berubah
    const updateData: any = {
      updatedAt: new Date()
    };

    if (serviceId !== undefined) updateData.serviceId = serviceId;
    if (type !== undefined) updateData.type = type.trim();
    if (highlight !== undefined) updateData.highlight = highlight;
    if (link !== undefined) updateData.link = link.trim();
    
    // Handle price calculations
    const finalPrice = price !== undefined ? price : existingPackage.price;
    const finalDiscount = discount !== undefined ? discount : existingPackage.discount;
    
    if (price !== undefined) updateData.price = price;
    if (discount !== undefined) updateData.discount = discount;
    
    updateData.priceOriginal = calculateOriginalPrice(finalPrice, finalDiscount);

    console.log("📊 Basic update data prepared");

    // **OPTIMISASI: Pisahkan operations untuk menghindari transaction timeout**
    
    // 1. Update package basic info terlebih dahulu (tanpa transaction)
    console.log("💾 Updating basic package info...");
    await prisma.package.update({ 
      where: { id: packageIdInt }, 
      data: updateData 
    });
    console.log("✅ Basic package info updated");

    // 2. Process features secara terpisah dengan batch operations
    if (Array.isArray(features)) {
      await processFeatures(packageIdInt, features);
    }

    // 3. Process requirements secara terpisah dengan batch operations
    if (Array.isArray(requirements)) {
      await processRequirements(packageIdInt, requirements);
    }

    // 4. Fetch updated package data
    console.log("🔍 Fetching final updated package...");
    const updatedPackage = await prisma.package.findUnique({
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

    if (!updatedPackage) {
      throw new Error("Failed to retrieve updated package data");
    }

    // Format response
    const responseData = {
      ...updatedPackage,
      features: updatedPackage.features.map((f) => ({
        feature: f.feature.name,
        status: f.status,
      })),
      requirements: updatedPackage.requirements.map((r) => r.requirement.name),
    };

    console.log("✅ Package update completed successfully");

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Package updated successfully",
      data: responseData,
    });
    
  } catch (err) {
    console.error("❌ PATCH /api/packages/[id] error:", err);
    
    let errorMessage = "Server error";
    if (err instanceof Error) {
      errorMessage = err.message;
      
      // Handle specific errors
      if (err.message.includes('Unique constraint')) {
        errorMessage = "A package with similar features already exists";
      } else if (err.message.includes('Foreign key constraint')) {
        errorMessage = "Related service not found";
      } else if (err.message.includes('Database') || err.message.includes('transaction')) {
        errorMessage = "Database operation timed out. Please try again with less data.";
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { 
          error: String(err)
        })
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