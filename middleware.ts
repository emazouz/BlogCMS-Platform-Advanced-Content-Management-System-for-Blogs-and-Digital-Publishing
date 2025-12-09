import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const isAuth = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  if (isAdminPage && !isAuth) {
    const from = req.nextUrl.pathname;
    return NextResponse.redirect(
      new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.nextUrl)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
