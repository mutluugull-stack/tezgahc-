import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.isAdmin) {
    const url = req.nextUrl.clone();
    url.pathname = "/giris";
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    url.searchParams.set("adminOnly", "1");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
