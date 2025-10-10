import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const currentUser = verifyAuth(req)

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


// export async function GET(req: Request) {
//   const authHeader = req.headers.get("authorization");
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return NextResponse.json({ error: "No token provided" }, { status: 401 });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
//       id: number;
//     };

//     // Cari user di database berdasarkan ID dari token
//     const user = await prisma.user.findUnique({
//       where: { id: decoded.id },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         role: true,
//         createdAt: true,
//       },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({ user });
//   } catch (error) {
//     console.error("JWT verification error:", error);
//     return NextResponse.json(
//       { error: "Invalid or expired token" },
//       { status: 401 }
//     );
//   }
// }
