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

// ===================== PATCH (UPDATE) =====================
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔄 Starting PATCH operation for package");
    
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
      features,
      requirements,
    } = body;

    console.log("📨 Received update data:", {
      serviceId,
      type,
      highlight,
      price,
      discount,
      link,
      featuresCount: features?.length,
      requirementsCount: requirements?.length
    });

    // Enhanced validation
    if (serviceId !== undefined) {
      if (typeof serviceId !== 'number' || serviceId <= 0) {
        return NextResponse.json(
          { success: false, message: "Invalid service ID" },
          { status: 400 }
        );
      }

      // Validate service exists if serviceId is provided
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

    if (type !== undefined && (!type.trim() || type.length > 100)) {
      return NextResponse.json(
        { success: false, message: "Type must be between 1 and 100 characters" },
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

    console.log("✅ Package found, proceeding with update...");

    // Prepare update data
    const updateData: {
      serviceId?: number;
      type?: string;
      highlight?: boolean;
      price?: number;
      priceOriginal?: number;
      discount?: number;
      link?: string;
      updatedAt?: Date;
    } = {
      updatedAt: new Date() // Always update the timestamp
    };

    // Only update fields that are provided
    if (serviceId !== undefined) updateData.serviceId = serviceId;
    if (type !== undefined) updateData.type = type.trim();
    if (highlight !== undefined) updateData.highlight = highlight;
    if (link !== undefined) updateData.link = link.trim();
    
    // Handle price and discount calculation
    const finalPrice = price !== undefined ? price : existingPackage.price;
    const finalDiscount = discount !== undefined ? discount : existingPackage.discount;
    
    if (price !== undefined) updateData.price = price;
    if (discount !== undefined) updateData.discount = discount;
    
    // Calculate original price
    updateData.priceOriginal = calculateOriginalPrice(finalPrice, finalDiscount);

    console.log("📊 Update data prepared:", updateData);

    // Perform transaction with enhanced error handling
    let updatedPackage;
    try {
      updatedPackage = await prisma.$transaction(async (tx) => {
        console.log("💾 Starting database transaction...");

        // 1. Update package basic info
        const updated = await tx.package.update({ 
          where: { id: packageIdInt }, 
          data: updateData 
        });
        console.log("✅ Package basic info updated");

        // 2. Update features if provided
        if (features && Array.isArray(features)) {
          console.log("🔄 Processing features:", features.length);
          
          // Delete existing package features
          await tx.packageFeature.deleteMany({
            where: { packageId: packageIdInt },
          });
          console.log("✅ Existing features deleted");

          // Insert new features
          for (const [index, f] of features.entries()) {
            if (!f.feature || f.feature.trim() === '') {
              console.log(`⏭️ Skipping empty feature at index ${index}`);
              continue;
            }

            const featureName = f.feature.trim();
            console.log(`📝 Processing feature: ${featureName}`);

            // Upsert feature
            const feature = await tx.feature.upsert({
              where: { name: featureName },
              create: { name: featureName },
              update: {},
            });
            console.log(`✅ Feature upserted with ID: ${feature.id}`);

            // Create package-feature relationship
            await tx.packageFeature.create({
              data: {
                packageId: packageIdInt,
                featureId: feature.id,
                status: f.status !== undefined ? f.status : true,
              },
            });
            console.log(`✅ Package-feature relationship created`);
          }
          console.log("✅ All features processed");
        }

        // 3. Update requirements if provided
        if (requirements && Array.isArray(requirements)) {
          console.log("🔄 Processing requirements:", requirements.length);
          
          // Delete existing package requirements
          await tx.packageRequirement.deleteMany({
            where: { packageId: packageIdInt },
          });
          console.log("✅ Existing requirements deleted");

          // Insert new requirements
          for (const [index, r] of requirements.entries()) {
            if (!r || r.trim() === '') {
              console.log(`⏭️ Skipping empty requirement at index ${index}`);
              continue;
            }

            const requirementName = r.trim();
            console.log(`📝 Processing requirement: ${requirementName}`);

            // Upsert requirement
            const req = await tx.requirement.upsert({
              where: { name: requirementName },
              create: { name: requirementName },
              update: {},
            });
            console.log(`✅ Requirement upserted with ID: ${req.id}`);

            // Create package-requirement relationship
            await tx.packageRequirement.create({
              data: { 
                packageId: packageIdInt, 
                requirementId: req.id 
              },
            });
            console.log(`✅ Package-requirement relationship created`);
          }
          console.log("✅ All requirements processed");
        }

        // 4. Fetch final updated package with relations
        console.log("🔍 Fetching updated package with relations...");
        const finalPackage = await tx.package.findUnique({
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
        console.log("✅ Final package data fetched");
        
        return finalPackage;
      });

      console.log("🎉 Transaction completed successfully");

    } catch (transactionError) {
      console.error("❌ Transaction failed:", transactionError);
      throw transactionError;
    }

    if (!updatedPackage) {
      throw new Error("Failed to retrieve updated package data");
    }

    // Format response data
    const responseData = {
      ...updatedPackage,
      features: updatedPackage.features.map((f) => ({
        feature: f.feature.name,
        status: f.status,
      })),
      requirements: updatedPackage.requirements.map((r) => r.requirement.name),
    };

    console.log("📤 Sending success response");

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Package updated successfully",
      data: responseData,
    });
    
  } catch (err) {
    console.error("❌ PATCH /api/packages/[id] error:", err);
    
    // More detailed error logging
    let errorMessage = "Server error";
    let errorDetails = null;

    if (err instanceof Error) {
      errorMessage = err.message;
      console.error("Error name:", err.name);
      console.error("Error message:", err.message);
      
      if (err.stack) {
        console.error("Error stack:", err.stack);
        errorDetails = process.env.NODE_ENV === 'development' ? err.stack : undefined;
      }

      // Handle specific Prisma errors
      if (err.message.includes('Unique constraint')) {
        errorMessage = "A package with similar features already exists";
      } else if (err.message.includes('Foreign key constraint')) {
        errorMessage = "Related service or feature not found";
      } else if (err.message.includes('Database')) {
        errorMessage = "Database connection error";
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { 
          error: String(err),
          details: errorDetails
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