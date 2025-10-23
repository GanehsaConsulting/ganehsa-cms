import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");

  // Daftar origin yang diizinkan
  const allowedOrigins = [
    "http://localhost:3000",
    "https://ganesha-cms.vercel.app",
  ];

  // Jika origin diizinkan, tambahkan header CORS
  const response = NextResponse.next();
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Credentials", "true");

  // Handle preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  return response;
}

// Aktifkan hanya untuk rute API
export const config = {
  matcher: ["/api/:path*"],
};
