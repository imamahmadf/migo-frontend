import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAccess = request.cookies.has("migo_access");
  const hasRefresh = request.cookies.has("migo_refresh");
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAccount = pathname === "/akun" || pathname.startsWith("/akun/");

  if (pathname === "/akun/konten" || pathname.startsWith("/akun/konten/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/akun/, "/admin");
    return NextResponse.redirect(url);
  }

  if (pathname === "/akun/pengguna" || pathname.startsWith("/akun/pengguna/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/akun/, "/admin");
    return NextResponse.redirect(url);
  }

  if ((isAccount || isAdminPath) && !hasAccess && !hasRefresh) {
    const loginUrl = new URL("/masuk", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/masuk" && (hasAccess || hasRefresh)) {
    return NextResponse.redirect(new URL("/akun", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/akun", "/akun/:path*", "/admin", "/admin/:path*", "/masuk"],
};
