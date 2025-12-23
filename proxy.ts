import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/auth/login", "/auth/signOtp"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const sessionId = req.cookies.get("sessionId")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (pathname.startsWith("/businesspanel")) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/") {
    if (refreshToken) {
      return NextResponse.redirect(new URL("/workspace/business", req.url));
    }
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    if (refreshToken) {
      return NextResponse.redirect(new URL("/workspace/business", req.url));
    }
    return NextResponse.next();
  }

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|images).*)"],
};
