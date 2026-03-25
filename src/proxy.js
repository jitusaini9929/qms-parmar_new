import { getServerSession } from "next-auth";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const isAdminPage = req.nextUrl.pathname.startsWith("/dashboard");

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if(Date.now() >= token?.expires) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isAdminPage && ["ADMIN", "SUPERADMIN"].includes(token?.user?.role)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/dashboard/:path*", "/profile"] };