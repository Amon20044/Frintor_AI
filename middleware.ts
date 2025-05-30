import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/student/auth", "/mentor/auth", "/admin/auth"];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // API routes that need special handling
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    if (request.method === 'OPTIONS') {
      return response;
    }
  }

  // Check for authentication tokens based on route
  let token = null;
  let redirectPath = "/";

  if (pathname.startsWith("/student")) {
    token =
      request.cookies.get("studentToken")?.value ||
      request.headers.get("authorization")?.split(" ")[1];
    redirectPath = "/student/auth";
  } else if (pathname.startsWith("/mentor")) {
    token =
      request.cookies.get("mentorToken")?.value ||
      request.headers.get("authorization")?.split(" ")[1];
    redirectPath = "/mentor/auth";
  } else if (pathname.startsWith("/admin")) {
    token =
      request.cookies.get("adminToken")?.value ||
      request.headers.get("authorization")?.split(" ")[1];
    redirectPath = "/admin/auth";
  }
  request.headers.set("Access-Control-Allow-Origin", "*");
  request.headers.set("Access-Control-Allow-Methods", "*");
  request.headers.set("Access-Control-Allow-Headers", "Content-Type");
  if (!token) {
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_TOKEN_SECRET!);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }
}

export const config = {
  matcher: ["/student/:path*", "/mentor/:path*", "/admin/:path*"],
};
