import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json(); 
    // identifier bisa berupa email atau username

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/Username & password wajib diisi" },
        { status: 400 }
      );
    }

    // cari user berdasarkan email ATAU username (name)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { name: identifier },
        ],
      },
    });
    

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // cek password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    // generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" } // expired 7 hari
    );

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
