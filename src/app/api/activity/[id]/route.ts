import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Status } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";

const prisma = new PrismaClient();

// GET DETAIL ACTIVITY WITH SPECIFIC ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    const activityId = Number(params.id);

    if (isNaN(activityId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid activity ID",
          data: null,
        },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        medias: {
          include: {
            media: {
              select: {
                id: true,
                url: true,
                type: true,
                title: true,
                alt: true,
                size: true,
              },
            },
          },
        },
      },
    });

    if (!activity) {
      return NextResponse.json(
        {
          success: false,
          message: "Activity not found",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Success get activity detail",
      data: activity,
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "unknown error";
    console.log(errMsg);
    return NextResponse.json(
      {
        success: false,
        message: errMsg,
      },
      { status: 500 }
    );
  }
}

// EDIT ACTIVITY (PATCH - Partial Update)
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

    const activityId = Number(params.id);

    if (isNaN(activityId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid activity ID",
        },
        { status: 400 }
      );
    }

    // Check if activity exists
    const existingActivity = await prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!existingActivity) {
      return NextResponse.json(
        {
          success: false,
          message: "Activity not found",
        },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      title,
      desc,
      longDesc,
      date,
      showTitle,
      instaUrl,
      status,
      mediaIds,
    } = body;

    // Build update data dynamically (only include fields that are provided)
    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (desc !== undefined) updateData.desc = desc;
    if (longDesc !== undefined) updateData.longDesc = longDesc;
    if (date !== undefined) updateData.date = date;
    if (showTitle !== undefined) updateData.showTitle = showTitle;
    if (instaUrl !== undefined) updateData.instaUrl = instaUrl;
    if (status !== undefined) {
      // Validate status
      if (!["DRAFT", "PUBLISH", "ARCHIVE"].includes(status)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid status. Must be DRAFT, PUBLISH, or ARCHIVE",
          },
          { status: 400 }
        );
      }
      updateData.status = status;
    }

    // Handle media relations
    if (mediaIds !== undefined) {
      if (!Array.isArray(mediaIds)) {
        return NextResponse.json(
          {
            success: false,
            message: "mediaIds must be an array",
          },
          { status: 400 }
        );
      }

      // Delete existing relations and create new ones
      updateData.medias = {
        deleteMany: {},
        create: mediaIds.map((mediaId: number) => ({
          media: {
            connect: { id: mediaId },
          },
        })),
      };
    }

    // Update activity
    const updatedActivity = await prisma.activity.update({
      where: { id: activityId },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        medias: {
          include: {
            media: {
              select: {
                id: true,
                url: true,
                type: true,
                title: true,
                alt: true,
                size: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Activity with id ${params.id} updated successfully!`,
      data: updatedActivity,
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "unknown error";
    console.log(errMsg);
    return NextResponse.json(
      {
        success: false,
        message: errMsg,
      },
      { status: 500 }
    );
  }
}

// DELETE ACTIVITY
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

    const activityId = Number(params.id);

    if (isNaN(activityId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid activity ID",
        },
        { status: 400 }
      );
    }

    // Check if activity exists before deleting
    const existingActivity = await prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!existingActivity) {
      return NextResponse.json(
        {
          success: false,
          message: "Activity not found",
        },
        { status: 404 }
      );
    }

    // Delete activity (cascade will handle ActivityMedia relations)
    await prisma.activity.delete({
      where: { id: activityId },
    });

    return NextResponse.json({
      success: true,
      message: `Activity with id ${params.id} deleted successfully!`,
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "unknown error";
    console.log(errMsg);
    return NextResponse.json(
      {
        success: false,
        message: errMsg,
      },
      { status: 500 }
    );
  }
}