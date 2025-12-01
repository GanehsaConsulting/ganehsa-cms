import { verifyAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {  id } = await params;
    const projectId = Number(id);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, message: "Invalid project ID" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
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

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Get project data successfully",
      data: project,
    });
  } catch (err) {
    console.error("GET PROJECT ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH update project
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

     const { id } = await params;
    const projectId = Number(id);

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const companyName = formData.get("companyName") as string;
    const link = formData.get("link") as string;
    const previewFile = formData.get("preview") as File | null;
    const packageIds = formData.get("packageIds") as string;

    if (!name || !companyName || !link) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
      include: { packages: true },
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    let previewUrl = existingProject.preview;
    let previewPublicId = existingProject.previewPublicId || "";

    // Upload new preview image if provided
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

      // Delete old image from Cloudinary if exists
      if (existingProject.previewPublicId) {
        try {
          await cloudinary.uploader.destroy(existingProject.previewPublicId);
        } catch (error) {
          console.error("Error deleting old preview:", error);
        }
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

    // Update project
    try {
      // ✅ PERBAIKAN: Gunakan PackageProject (bukan projectPackage)
      // Delete existing package relations
      await prisma.packageProject.deleteMany({
        where: { projectId: projectId },
      });

      // Update project
      const project = await prisma.project.update({
        where: { id: projectId },
        data: {
          name,
          companyName,
          link,
          preview: previewUrl,
          previewPublicId,
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
        status: 200,
        success: true,
        message: "Project updated successfully",
        data: project,
      });
    } catch (error) {
      console.error("Update error:", error);
      throw error;
    }
  } catch (err) {
    console.error("UPDATE PROJECT ERROR:", err);
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

// DELETE project
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const projectId = Number(id);

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    // Delete from Cloudinary if exists
    if (project.previewPublicId) {
      try {
        await cloudinary.uploader.destroy(project.previewPublicId);
      } catch (error) {
        console.error("Error deleting preview from Cloudinary:", error);
      }
    }

    // Delete project (cascade akan menghapus PackageProject records secara otomatis)
    await prisma.project.delete({
      where: { id: projectId },
    });

    revalidatePath("/dashboard/projects");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    console.error("DELETE PROJECT ERROR:", err);
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
