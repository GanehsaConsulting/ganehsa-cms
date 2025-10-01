import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyAuth } from "./lib/auth"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("token")?.value

  // proteksi dashboard
  if (pathname.startsWith("/dashboard")) {
    const user = verifyAuth(token)
    if (!user) return NextResponse.redirect(new URL("/login", req.url))
  }

//   // proteksi API /users
//   if (pathname.startsWith("/api/users")) {
//     const user = verifyAuth(token)
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }
//   }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/users/:path*"],
}
