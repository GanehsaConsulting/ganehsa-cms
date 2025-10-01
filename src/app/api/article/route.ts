import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { verifyAuth } from "@/lib/auth"  // helper auth pakai jsonwebtoken

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    // 🔒 ambil token dari cookie
    const cookie = req.headers.get("cookie") || ""
    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1]

    const user = verifyAuth(token)

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", data: [] },
        { status: 401 }
      )
    }

    // 🔎 query data articles
    const articlesData = await prisma.article.findMany()

    if (!articlesData || articlesData.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Article data not found",
        data: [],
      })
    }

    return NextResponse.json({
      success: true,
      message: "Success get article data",
      data: articlesData,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, message: "Internal server error", data: [] },
      { status: 500 }
    )
  }
}
