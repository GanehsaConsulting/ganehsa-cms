// app/api/packages/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface PackageFeatureRelation {
  status: boolean;
  feature: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

interface PackageRequirementRelation {
  requirement: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

interface PackageWithRelations {
  id: number;
  type: string;
  highlight: boolean;
  price: number;
  priceOriginal: number;
  link: string;
  createdAt: Date;
  updatedAt: Date;
  features: PackageFeatureRelation[];
  requirements: PackageRequirementRelation[];
}

// GET: Get package by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const packageId = parseInt(params.id);

    if (isNaN(packageId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid package ID",
        },
        { status: 400 }
      );
    }

    const packageData = await prisma.package.findUnique({
      where: { id: packageId },
      include: {
        features: {
          include: {
            feature: true,
          },
          orderBy: {
            feature: {
              name: "asc",
            },
          },
        },
        requirements: {
          include: {
            requirement: true,
          },
          orderBy: {
            requirement: {
              name: "asc",
            },
          },
        },
      },
    });

    if (!packageData) {
      return NextResponse.json(
        {
          success: false,
          message: "Package not found",
        },
        { status: 404 }
      );
    }

    // Transform response
    const transformedPackage = {
      id: packageData.id,
      type: packageData.type,
      highlight: packageData.highlight,
      price: packageData.price,
      priceOriginal: packageData.priceOriginal,
      link: packageData.link,
      features: packageData.features.map((pf) => ({
        feature: pf.feature.name,
        status: pf.status,
      })),
      requirements: packageData.requirements.map((pr) => pr.requirement.name),
      createdAt: packageData.createdAt,
      updatedAt: packageData.updatedAt,
    };

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Package fetched successfully",
      data: transformedPackage,
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "unknown error";
    console.error("GET /api/packages/[id] error:", errMsg);
    return NextResponse.json(
      {
        success: false,
        message: errMsg,
      },
      { status: 500 }
    );
  }
}

// PATCH: Update package
export async function PATCH(
  req: NextRequest,
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

    const packageId = parseInt(params.id);

    if (isNaN(packageId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid package ID",
        },
        { status: 400 }
      );
    }

    // Check if package exists
    const existingPackage = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!existingPackage) {
      return NextResponse.json(
        {
          success: false,
          message: "Package not found",
        },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      type,
      highlight,
      price,
      priceOriginal,
      link,
      features,
      requirements,
    } = body;

    // Validation for price if provided
    if (price !== undefined && price < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Price must be a positive number",
        },
        { status: 400 }
      );
    }

    if (priceOriginal !== undefined && priceOriginal < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Original price must be a positive number",
        },
        { status: 400 }
      );
    }

    // Validate features format if provided
    if (features !== undefined) {
      if (!Array.isArray(features)) {
        return NextResponse.json(
          {
            success: false,
            message: "Features must be an array",
          },
          { status: 400 }
        );
      }

      for (const f of features) {
        if (!f.feature || typeof f.status !== "boolean") {
          return NextResponse.json(
            {
              success: false,
              message:
                "Each feature must have 'feature' (string) and 'status' (boolean)",
            },
            { status: 400 }
          );
        }
      }
    }

    // Validate requirements format if provided
    if (requirements !== undefined) {
      if (!Array.isArray(requirements)) {
        return NextResponse.json(
          {
            success: false,
            message: "Requirements must be an array of strings",
          },
          { status: 400 }
        );
      }
    }

    // Build update data
    const updateData: any = {};

    if (type !== undefined) updateData.type = type;
    if (highlight !== undefined) updateData.highlight = highlight;
    if (price !== undefined) updateData.price = price;
    if (priceOriginal !== undefined) updateData.priceOriginal = priceOriginal;
    if (link !== undefined) updateData.link = link;

    // Update package with relations
    const updatedPackage = await prisma.$transaction(async (tx) => {
      // Update basic fields
      const pkg = await tx.package.update({
        where: { id: packageId },
        data: updateData,
      });

      // Update features if provided
      if (features !== undefined) {
        // Delete existing features
        await tx.packageFeature.deleteMany({
          where: { packageId },
        });

        // Create new features
        if (features.length > 0) {
          await tx.packageFeature.createMany({
            data: await Promise.all(
              features.map(
                async (f: { feature: string; status: boolean }) => {
                  // Ensure feature exists
                  const feature = await tx.feature.upsert({
                    where: { name: f.feature },
                    create: { name: f.feature },
                    update: {},
                  });

                  return {
                    packageId,
                    featureId: feature.id,
                    status: f.status,
                  };
                }
              )
            ),
          });
        }
      }

      // Update requirements if provided
      if (requirements !== undefined) {
        // Delete existing requirements
        await tx.packageRequirement.deleteMany({
          where: { packageId },
        });

        // Create new requirements
        if (requirements.length > 0) {
          await tx.packageRequirement.createMany({
            data: await Promise.all(
              requirements.map(async (reqName: string) => {
                // Ensure requirement exists
                const requirement = await tx.requirement.upsert({
                  where: { name: reqName },
                  create: { name: reqName },
                  update: {},
                });

                return {
                  packageId,
                  requirementId: requirement.id,
                };
              })
            ),
          });
        }
      }

      // Fetch updated package with relations
      return await tx.package.findUnique({
        where: { id: packageId },
        include: {
          features: {
            include: {
              feature: true,
            },
          },
          requirements: {
            include: {
              requirement: true,
            },
          },
        },
      });
    });

    if (!updatedPackage) {
      throw new Error("Failed to fetch updated package");
    }

    // Transform response
    const transformedPackage = {
      id: updatedPackage.id,
      type: updatedPackage.type,
      highlight: updatedPackage.highlight,
      price: updatedPackage.price,
      priceOriginal: updatedPackage.priceOriginal,
      link: updatedPackage.link,
      features: updatedPackage.features.map((pf) => ({
        feature: pf.feature.name,
        status: pf.status,
      })),
      requirements: updatedPackage.requirements.map(
        (pr) => pr.requirement.name
      ),
      createdAt: updatedPackage.createdAt,
      updatedAt: updatedPackage.updatedAt,
    };

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Package updated successfully",
      data: transformedPackage,
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "unknown error";
    console.error("PATCH /api/packages/[id] error:", errMsg);
    return NextResponse.json(
      {
        success: false,
        message: errMsg,
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete package
export async function DELETE(
  req: NextRequest,
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

    const packageId = parseInt(params.id);

    if (isNaN(packageId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid package ID",
        },
        { status: 400 }
      );
    }

    // Check if package exists
    const existingPackage = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!existingPackage) {
      return NextResponse.json(
        {
          success: false,
          message: "Package not found",
        },
        { status: 404 }
      );
    }

    // Delete package (cascade will handle relations)
    await prisma.package.delete({
      where: { id: packageId },
    });

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Package deleted successfully",
      data: {
        id: packageId,
      },
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "unknown error";
    console.error("DELETE /api/packages/[id] error:", errMsg);
    return NextResponse.json(
      {
        success: false,
        message: errMsg,
      },
      { status: 500 }
    );
  }
}