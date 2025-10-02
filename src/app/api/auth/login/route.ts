import { NextResponse } from "next/server";
import { PrismaClient, $Enums } from "@prisma/client"; // pakai $Enums, bukan Role
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/Username & password wajib diisi" },
        { status: 400 }
      );
    }

    // cari user berdasarkan email ATAU username
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { name: identifier }],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // validasi password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    // generate token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as $Enums.Role, // pakai $Enums.Role
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role, // hasilnya "SUPER_ADMIN" | "ADMIN" | "AUTHOR" | "VIEWER"
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
