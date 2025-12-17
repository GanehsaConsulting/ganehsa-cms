import { NextRequest, NextResponse } from "next/server";
// import { Prisma, Status } from "@prisma/client";
import prisma from "@/lib/prisma";

// GET - ambil semua counter dengan filter periode
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period"); 

    let startDate: Date | undefined;
    const now = new Date();

    if (period) {
      switch (period) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "1week":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "1month":
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case "3month":
          startDate = new Date(now.setMonth(now.getMonth() - 3));
          break;
        case "6month":
          startDate = new Date(now.setMonth(now.getMonth() - 6));
          break;
        case "1year":
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = undefined;
      }
    }

    const counters = await prisma.counter.findMany({
      where: startDate
        ? {
            createdAt: {
              gte: startDate,
            },
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      message: "Get Counters Successfully!",
      status: 200,
      data: counters,
      filter: period || "all",
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

// POST → tambah + increment counter
export async function POST(req: NextRequest) {
  try {

    const body = await req.json();
    const { refId, type } = body;

    if (!refId || !type) {
      return NextResponse.json(
        { success: false, message: "refId and type are required" },
        { status: 400 }
      );
    }

    // cek record existing
    const existing = await prisma.counter.findFirst({
      where: { refId, type },
    });

    let updatedData;

    if (existing) {
      // increment
      updatedData = await prisma.counter.update({
        where: { id: existing.id },
        data: { count: { increment: 1 } },
      });
    } else {
      // create baru
      updatedData = await prisma.counter.create({
        data: { refId, type, count: 1 },
      });
    }

    return NextResponse.json({
      success: true,
      message: existing
        ? "Counter updated successfully!"
        : "Counter created successfully!",
      status: 200,
      data: updatedData,
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
