import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "ADMIN";
    const isNP = token?.role === "NURSE_PRACTITIONER";
    const isPhysician = token?.role === "PHYSICIAN";
    
    // Handle role-based redirections after login
    if (token && req.nextUrl.pathname === "/auth") {
      if (isAdmin) {
        return NextResponse.redirect(new URL("/admin", req.url));
      } else if (isNP) {
        return NextResponse.redirect(new URL("/np/find-match", req.url));
      } else if (isPhysician) {
        return NextResponse.redirect(new URL("/np", req.url));
      }
    }

    // Protect admin routes
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    // Protect NP routes
    const isNPRoute = req.nextUrl.pathname.startsWith("/np");
    if (isNPRoute && !(isNP || isPhysician || isAdmin)) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/np/:path*", "/"],
};
