// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET user by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyAuth(req);
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized, super admin only!" },
        { status: 401 }
      );
    }

    const userData = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
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
            title: true, // Diperbaiki dari 'action' ke 'title'
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
            name: true, // Diperbaiki dari 'title' ke 'name'
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
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyAuth(req);
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized, super admin only!" },
        { status: 401 }
      );
    }

    const { email, name, password, role } = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const updateData: any = {
      email,
      name,
      role,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(params.id) },
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
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyAuth(req);
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized, super admin only!" },
        { status: 401 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is trying to delete themselves
    if (Number(user.id) === Number(params.id)) { // Diperbaiki dari user.userId ke user.id
      return NextResponse.json(
        { success: false, message: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    console.error("❌ Error deleting user:", err);
    
    // Handle foreign key constraint errors
    if (err.code === "P2003") {
      return NextResponse.json(
        { 
          success: false, 
          message: "Cannot delete user because they have related records. Please delete associated data first." 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}