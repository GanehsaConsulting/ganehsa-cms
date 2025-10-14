import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Search, Pagination, Filter
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Query parameters
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type") || ""; // Filter by type
    const highlight = searchParams.get("highlight"); // Filter by highlight
    
    // Validation
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid pagination parameters. Page must be >= 1 and limit between 1-100",
        },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Search by type
    if (search) {
      where.type = {
        contains: search,
        mode: "insensitive",
      };
    }

    // Filter by exact type
    if (type) {
      where.type = type;
    }

    // Filter by highlight
    if (highlight !== null && highlight !== undefined) {
      where.highlight = highlight === "true";
    }

    // Get total count for pagination
    const totalItems = await prisma.package.count({ where });

    // Get packages with relations
    const packages = await prisma.package.findMany({
      where,
      skip,
      take: limit,
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
      orderBy: [
        { highlight: "desc" }, // Highlighted packages first
        { createdAt: "desc" },
      ],
    });

    // Transform data to match your frontend format
    const transformedPackages = packages.map((pkg: any) => ({
      id: pkg.id,
      type: pkg.type,
      highlight: pkg.highlight,
      price: pkg.price,
      priceOriginal: pkg.priceOriginal,
      link: pkg.link,
      features: pkg.features.map((pf: any) => ({
        feature: pf.feature.name,
        status: pf.status,
      })),
      requirements: pkg.requirements.map((pr: any) => pr.requirement.name),
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    }));

    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Packages fetched successfully",
      data: transformedPackages,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "unknown error";
    console.error("GET /api/packages error:", errMsg);
    return NextResponse.json(
      {
        success: false,
        message: errMsg,
      },
      { status: 500 }
    );
  }
}

// POST: Create Package
export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validation
    const {
      type,
      highlight = false,
      price,
      priceOriginal,
      link,
      features = [],
      requirements = [],
    } = body;

    if (!type || !price || !priceOriginal || !link) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: type, price, priceOriginal, link",
        },
        { status: 400 }
      );
    }

    if (price < 0 || priceOriginal < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Price values must be positive numbers",
        },
        { status: 400 }
      );
    }

    // Validate features format
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
            message: "Each feature must have 'feature' (string) and 'status' (boolean)",
          },
          { status: 400 }
        );
      }
    }

    // Validate requirements format
    if (!Array.isArray(requirements)) {
      return NextResponse.json(
        {
          success: false,
          message: "Requirements must be an array of strings",
        },
        { status: 400 }
      );
    }

    // Create package with nested relations
    const newPackage = await prisma.package.create({
      data: {
        type,
        highlight,
        price,
        priceOriginal,
        link,
        features: {
          create: features.map((f: { feature: string; status: boolean }) => ({
            status: f.status,
            feature: {
              connectOrCreate: {
                where: { name: f.feature },
                create: { name: f.feature },
              },
            },
          })),
        },
        requirements: {
          create: requirements.map((reqName: string) => ({
            requirement: {
              connectOrCreate: {
                where: { name: reqName },
                create: { name: reqName },
              },
            },
          })),
        },
      },
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

    // Transform response
    const transformedPackage = {
      id: newPackage.id,
      type: newPackage.type,
      highlight: newPackage.highlight,
      price: newPackage.price,
      priceOriginal: newPackage.priceOriginal,
      link: newPackage.link,
      features: newPackage.features.map((pf: any) => ({
        feature: pf.feature.name,
        status: pf.status,
      })),
      requirements: newPackage.requirements.map((pr: any) => pr.requirement.name),
      createdAt: newPackage.createdAt,
      updatedAt: newPackage.updatedAt,
    };

    return NextResponse.json({
      status: 201,
      success: true,
      message: "Package created successfully",
      data: transformedPackage,
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "unknown error";
    console.error("POST /api/packages error:", errMsg);
    return NextResponse.json(
      {
        success: false,
        message: errMsg,
      },
      { status: 500 }
    );
  }
}