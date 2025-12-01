import { NextRequest, NextResponse } from "next/server";
import { Prisma, Status } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getActivitiesCached } from "@/lib/cache/activity.cache";

export const revalidate = 60;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const showTitleParam = searchParams.get("showTitle");
    const isPromoParam = searchParams.get("isPromo");
    const statusParam = searchParams.get("status");
    const skip = (page - 1) * limit;

    const where: Prisma.ActivityWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { desc: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isPromoParam === "true" || isPromoParam === "false") {
      where.isPromo = isPromoParam === "true";
    }

    if (showTitleParam === "true" || showTitleParam === "false") {
      where.showTitle = showTitleParam === "true";
    }

    if (statusParam && Object.values(Status).includes(statusParam as Status)) {
      where.status = statusParam as Status;
    }

    // cacheKey parameters
    const params = { where, skip, limit };

    const { activities, total } = await getActivitiesCached(params);

    return NextResponse.json({
      success: true,
      message: "Success get activities data",
      data: activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : "unknown" },
      { status: 500 }
    );
  }
}


// ADD NEW ACTIVITY
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
    const {
      title,
      desc,
      longDesc,
      date,
      isPromo,
      showTitle,
      instaUrl,
      status,
      mediaIds,
    } = body;

    // Validation
    if (!title || !longDesc || !date) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, desc, longDesc, and date are required",
        },
        { status: 400 }
      );
    }

    // Prepare data with proper Prisma type
    const activityData: Prisma.ActivityCreateInput = {
      title,
      desc,
      longDesc,
      date,
      isPromo: isPromo ?? false,
      showTitle: showTitle ?? false,
      status: status ?? "DRAFT",
      author: {
        connect: { id: Number(user.id) },
      },
    };

    if (instaUrl) {
      activityData.instaUrl = instaUrl;
    }

    if (mediaIds && Array.isArray(mediaIds) && mediaIds.length > 0) {
      activityData.medias = {
        create: mediaIds.map((mediaId: number) => ({
          media: {
            connect: { id: mediaId },
          },
        })),
      };
    }

    const activity = await prisma.activity.create({
      data: activityData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        medias: {
          include: {
            media: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Created new activity successfully!",
        data: activity,
      },
      { status: 201 }
    );
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
