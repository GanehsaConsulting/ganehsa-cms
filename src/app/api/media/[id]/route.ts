import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const mediaID = Number(id);

    if (isNaN(mediaID)) {
      return NextResponse.json(
        { success: false, message: "Invalid media ID" },
        { status: 400 }
      );
    }

    // First, check if media exists and get Cloudinary publicId
    const media = await prisma.media.findUnique({
      where: { id: mediaID },
      include: {
        articleThumbnail: true,
        activities: {
          include: {
            activity: true
          }
        }
      }
    });

    if (!media) {
      return NextResponse.json(
        { success: false, message: `Media with id ${mediaID} not found` },
        { status: 404 }
      );
    }

    // Check if media is being used as thumbnail
    if (media.articleThumbnail) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Cannot delete media. It is currently used as thumbnail for article: ${media.articleThumbnail.title}` 
        },
        { status: 400 }
      );
    }

    // Check if media is being used in activities
    if (media.activities.length > 0) {
      const activityTitles = media.activities.map(a => a.activity.title).join(', ');
      return NextResponse.json(
        { 
          success: false, 
          message: `Cannot delete media. It is currently used in activities: ${activityTitles}` 
        },
        { status: 400 }
      );
    }

    // Delete from Cloudinary if publicId exists
    if (media.publicId) {
      try {
        // Determine resource type based on stored type
        let resourceType: "image" | "video" | "raw" = "image";
        if (media.type.startsWith('video/')) {
          resourceType = "video";
        } else if (media.type === 'application/pdf') {
          resourceType = "raw";
        }

        await cloudinary.uploader.destroy(media.publicId, {
          resource_type: resourceType,
          invalidate: true // Optional: CDN cache invalidation
        });
        
        console.log(`Successfully deleted from Cloudinary: ${media.publicId}`);
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion error:", cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
        // You might want to handle this differently based on your requirements
      }
    }

    // Delete from database
    const deletedMedia = await prisma.media.delete({
      where: { id: mediaID }
    });

    if (!deletedMedia) {
      return NextResponse.json(
        { success: false, message: `Failed to delete media with id ${mediaID}` },
        { status: 500 }
      );
    }

    revalidatePath("/dashboard/media");
    revalidatePath("/");

    return NextResponse.json({
      status: 200,
      success: true,
      message: `Media deleted successfully`,
    });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    
    // Handle Prisma foreign key constraint errors
    if (err instanceof Error && err.message.includes('foreign key constraint')) {
      return NextResponse.json(
        { success: false, message: "Cannot delete media. It is currently in use." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}