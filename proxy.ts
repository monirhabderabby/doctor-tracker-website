import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const hasToken = request.cookies.has("token");
  const isLogin = request.nextUrl.pathname === "/login";

  if (hasToken && isLogin) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!hasToken && !isLogin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.[^/]+$).*)"],
};
