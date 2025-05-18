import { NextRequest, NextResponse } from "next/server";
import { logtoConfig } from "./app/logto";
import { getLogtoContext } from "@logto/next/server-actions";

// Example of default export
export default async function middleware(request: NextRequest) {
  try {
    const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);
    // Protected routes pattern
    const protectedPaths = ["/np", "/admin"];
    const path = request.nextUrl.pathname;
    const isProtectedPath = protectedPaths.some((prefix) =>
      path.startsWith(prefix)
    );

    // Middleware logic
    if (isProtectedPath && !isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const requestHeaders = new Headers(request.headers);
    if (claims?.sub) {
      requestHeaders.set("x-user-id", claims.sub);
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Handle authentication errors gracefully
    console.error("Auth middleware error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/np/:path*",
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
