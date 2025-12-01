import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { calculateOriginalPrice } from "@/lib/helpers";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getPackagesCached } from "@/lib/cache/packages.cache";

// Interfaces
interface PackageFeature {
  feature: string;
  status: boolean;
}

interface CreatePackageRequest {
  serviceId: number;
  type: string;
  highlight?: boolean;
  price: number;
  discount: number;
  link: string;
  features?: PackageFeature[];
  requirements?: string[];
}

interface WhereClause {
  type?: { contains: string; mode: "insensitive" } | string;
  highlight?: boolean;
  serviceId?: number;
  service?: {
    slug: string;
  };
}

interface TransformedPackage {
  id: number;
  serviceId: number;
  type: string;
  highlight: boolean;
  price: number;
  discount: number;
  priceOriginal: number;
  link: string;
  features: Array<{ feature: string; status: boolean }>;
  requirements: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const revalidate = 60;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type") || "";
    const highlight = searchParams.get("highlight");
    const serviceId = searchParams.get("serviceId");
    const serviceSlug = searchParams.get("serviceSlug");

    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, message: "Invalid pagination parameters." },
        { status: 400 }
      );
    }

    const where: Prisma.PackageWhereInput = {};

    if (search) {
      where.type = { contains: search, mode: "insensitive" };
    }

    if (type) {
      where.type = type;
    }

    if (highlight) {
      where.highlight = highlight === "true";
    }

    if (serviceId && !isNaN(Number(serviceId))) {
      where.serviceId = Number(serviceId);
    }

    if (serviceSlug && serviceSlug !== "All") {
      where.service = { slug: serviceSlug };
    }

    // PARAMS UNTUK CACHE
    const params = { where, page, limit };

    const { packages, totalItems, totalPages } = await getPackagesCached(params);

    // Transformasi tetap di sini (cache tetap pure)
    const transformed = packages.map((pkg) => ({
      id: pkg.id,
      serviceId: pkg.serviceId,
      type: pkg.type,
      highlight: pkg.highlight,
      price: pkg.price,
      discount: pkg.discount,
      priceOriginal: pkg.priceOriginal,
      link: pkg.link,
      features: pkg.features.map((f) => ({
        feature: f.feature.name,
        status: f.status,
      })),
      requirements: pkg.requirements.map((r) => r.requirement.name),
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      message: "Packages fetched successfully",
      data: transformed,
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
    console.error("GET /api/packages error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


// ===================== POST (CREATE) =====================
export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body: CreatePackageRequest = await req.json();
    const { serviceId, type, highlight = false, price, discount, link, features = [], requirements = [] } = body;

    if (!serviceId || !type || !price || discount === undefined || !link)
      return NextResponse.json(
        { success: false, message: "Missing required fields: serviceId, type, price, discount, link" },
        { status: 400 }
      );

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) return NextResponse.json({ success: false, message: "Service not found" }, { status: 404 });

    const priceOriginal = await calculateOriginalPrice(price, discount);

    const newPackage = await prisma.package.create({
      data: {
        serviceId,
        type,
        highlight,
        price,
        discount,
        priceOriginal,
        link,
        features: {
          create: features.map((f) => ({
            status: f.status,
            feature: { connectOrCreate: { where: { name: f.feature }, create: { name: f.feature } } },
          })),
        },
        requirements: {
          create: requirements.map((r) => ({
            requirement: { connectOrCreate: { where: { name: r }, create: { name: r } } },
          })),
        },
      },
      include: {
        features: { include: { feature: true } },
        requirements: { include: { requirement: true } },
      },
    });

    const transformed: TransformedPackage = {
      id: newPackage.id,
      serviceId: newPackage.serviceId,
      type: newPackage.type,
      highlight: newPackage.highlight,
      price: newPackage.price,
      discount: newPackage.discount,
      priceOriginal: newPackage.priceOriginal,
      link: newPackage.link,
      features: newPackage.features.map((f) => ({ feature: f.feature.name, status: f.status })),
      requirements: newPackage.requirements.map((r) => r.requirement.name),
      createdAt: newPackage.createdAt,
      updatedAt: newPackage.updatedAt,
    };

    return NextResponse.json({
      status: 201,
      success: true,
      message: "Package created successfully",
      data: transformed,
    });
  } catch (err) {
    console.error("POST /api/packages error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
