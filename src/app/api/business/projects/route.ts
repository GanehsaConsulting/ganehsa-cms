// app/api/projects/route.ts
import { Prisma } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { getCachedProjects } from "@/lib/cache/projects.cache";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const packageId = searchParams.get("packageId");
    const serviceIdParams = searchParams.get("serviceId");
    const skip = (page - 1) * limit;

    const whereClause: Prisma.ProjectWhereInput = {
      packages: {
        some: {
          package: {
            serviceId: Number(serviceIdParams),
          },
        },
      },
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { companyName: { contains: search, mode: "insensitive" } },
      ];
    }

    if (packageId) {
      whereClause.packages = {
        some: {
          packageId: Number(packageId),
          package: { serviceId: Number(serviceIdParams) },
        },
      };
    }

    // ⬇⬇⬇ AMBIL DATA DARI CACHE (not query DB lagi)
    const { projects, total } = await getCachedProjects(
      whereClause,
      skip,
      limit
    );

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      message: "Get projects data successfully",
      data: projects,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (err) {
    console.error("GET PROJECTS ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error", data: [] },
      { status: 500 }
    );
  }
}


// POST create new project
export async function POST(req: Request) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const companyName = formData.get("companyName") as string;
    const link = formData.get("link") as string;
    const previewFile = formData.get("preview") as File | null;
    const packageIds = formData.get("packageIds") as string; // JSON array string

    if (!name || !companyName || !link) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    let previewUrl = "";
    let previewPublicId = "";

    // Upload preview image to Cloudinary if provided
    if (previewFile && previewFile.size > 0) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(previewFile.type)) {
        return NextResponse.json(
          { success: false, message: "Preview file type not allowed" },
          { status: 400 }
        );
      }

      if (previewFile.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, message: "Preview file size too large" },
          { status: 400 }
        );
      }

      const arrayBuffer = await previewFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = `data:${previewFile.type};base64,${buffer.toString(
        "base64"
      )}`;

      const uploadResponse = await cloudinary.uploader.upload(base64, {
        folder: "ganesha_cms_project_previews",
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      });

      previewUrl = uploadResponse.secure_url;
      previewPublicId = uploadResponse.public_id;
    }

    // Parse package IDs
    const parsedPackageIds: number[] = packageIds ? JSON.parse(packageIds) : [];

    // Create project with package relations
    const project = await prisma.project.create({
      data: {
        name,
        companyName,
        link,
        preview: previewUrl,
        previewPublicId,
        // ✅ BENAR: packages relation akan membuat records di PackageProject
        packages: {
          create: parsedPackageIds.map((pkgId) => ({
            packageId: pkgId,
          })),
        },
      },
      include: {
        packages: {
          include: {
            package: {
              include: {
                service: true,
              },
            },
          },
        },
      },
    });

    revalidatePath("/dashboard/projects");
    revalidatePath("/");

    return NextResponse.json({
      status: 201,
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
