import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

// interface EditProfileRequest {
//   email: string;
//   name: string;
//   password: string;
// }

export async function GET(req: Request) {
  try {
    const currentUser = verifyAuth(req);

    // Cari user di database berdasarkan ID dari token
    const user = await prisma.user.findUnique({
      where: { id: Number(currentUser?.id) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("JWT verification error:", error);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export async function PATCH(req: Request) {
  try {
    const currentUser = verifyAuth(req);

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Cari user di database berdasarkan ID dari token
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(currentUser.id) },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { name, email, password } = await req.json();

    // Jika ada email, cek apakah email sudah digunakan oleh user lain
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });
      if (emailExists) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
    }

    // Siapkan data untuk update
    const updateData: { name?: string; email?: string; password?: string } = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (password) {
      // Hash password baru
      updateData.password = await hashPassword(password);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: Number(currentUser.id) },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}