import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/login" ||
    path === "/register" ||
    path === "/verify-otp" ||
    path === "/forgot-password" ||
    path === "/reset-password";

  const token = request.cookies.get("access_token")?.value || "";

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/dashboard",
    "/insight",
    "/setting",
    "/transaction",
    "/chat",
    "/verify-otp",
    "/forgot-password",
    "/reset-password",
  ],
};
