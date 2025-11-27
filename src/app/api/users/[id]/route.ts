import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

interface UpdateUserData {
  email: string;
  name: string;
  role: Role; // Use the Role enum type instead of string
  password?: string;
}

// GET user by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyAuth(req);
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized, super admin only!" },
        { status: 401 }
      );
    }

    const { id } = await params
    const userIds = Number(id)

    const userData = await prisma.user.findUnique({
      where: { id: userIds },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        articles: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            status: true,
          },
        },
        activities: {
          select: {
            id: true,
            title: true,
            desc: true,
            date: true,
            createdAt: true,
            status: true,
          },
        },
        media: {
          select: {
            id: true,
            title: true,
            type: true,
            createdAt: true,
          },
        },
        wallpaper: {
          select: {
            id: true,
            name: true,
            url: true,
            publicId: true,
          },
        },
      },
    });

    if (!userData) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: userData,
    });
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// UPDATE user
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyAuth(req);
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized, super admin only!" },
        { status: 401 }
      );
    }

    const { id } = await params
    const userIds = Number(id)

    const { email, name, password, role } = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: { id: userIds },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Use proper typing with Role enum
    const updateData: UpdateUserData = {
      email,
      name,
      role: role as Role, // Cast to Role enum type
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userIds },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error("❌ Error updating user:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE user
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyAuth(req);
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized, super admin only!" },
        { status: 401 }
      );
    }

    const { id } = await params
    const userIds = Number(id)

    const existingUser = await prisma.user.findUnique({
      where: { id: userIds },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is trying to delete themselves
    if (Number(user.id) === userIds) {
      return NextResponse.json(
        { success: false, message: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: userIds },
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: unknown) {
    console.error("❌ Error deleting user:", err);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}