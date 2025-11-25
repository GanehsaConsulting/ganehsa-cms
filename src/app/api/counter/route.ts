import { NextRequest, NextResponse } from "next/server";
// import { Prisma, Status } from "@prisma/client";
import { verifyAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - ambil semua counter
export async function GET(req: NextRequest) {
  try {
    const counters = await prisma.counter.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      message: "Get Counters Successfully!",
      status: 200,
      data: counters,
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
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

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
