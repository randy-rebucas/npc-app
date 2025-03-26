import { NextResponse, NextRequest } from "next/server";
import { logtoConfig } from "./app/logto";
import { getLogtoContext } from "@logto/next/server-actions";
import { cookies } from "next/headers";

interface CustomClaims {
  role?: "admin" | "user";
}

async function getLogtoToken() {
  const cookieStore = await cookies();
  const existingToken = cookieStore.get("logtoToken");

  if (existingToken) {
    return existingToken.value;
  }

  try {
    const formData = new URLSearchParams({
      grant_type: "client_credentials",
      resource: process.env.LOGTO_RESOURCE!,
      scope: process.env.LOGTO_SCOPE!,
    });

    const tokenResponse = await fetch(
      `${process.env.LOGTO_ENDPOINT}oidc/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.LOGTO_API_APP_ID}:${process.env.LOGTO_API_APP_SECRET}`
          ).toString("base64")}`,
        },
        body: formData.toString(),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error(
        `Failed to get token: ${tokenResponse.status} ${tokenResponse.statusText}`
      );
    }

    const data = await tokenResponse.json();
    cookieStore.set("logtoToken", data.access_token);

    return data.access_token;
  } catch (error) {
    console.error("Error getting Logto token:", error);
    return null;
  }
}

async function getCustomClaims(
  userId: string,
  logtoToken: string
): Promise<CustomClaims | null> {
  try {
    const response = await fetch(
      `${process.env.LOGTO_ENDPOINT}api/users/${userId}/custom-data`,
      {
        headers: {
          Authorization: `Bearer ${logtoToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching custom claims:", error);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);

    // Redirect unauthenticated users to home
    if (!isAuthenticated || !claims?.sub) {
      console.warn("User not authenticated, redirecting to home");
      return NextResponse.redirect(new URL("/", req.url));
    }

    const logtoToken = await getLogtoToken();

    if (!logtoToken) {
      console.error("Failed to obtain Logto token");
      return NextResponse.redirect(new URL("/", req.url));
    }

    const customClaims = await getCustomClaims(claims.sub, logtoToken);
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isAdmin = customClaims?.role === "admin";

    if (customClaims?.hasOwnProperty("role")) {
      // Handle route access
      if (isAdminRoute && !isAdmin) {
        console.warn(`Unauthorized admin access attempt by user ${claims.sub}`);
        return NextResponse.redirect(new URL("/np", req.url));
      }
      // Only redirect to admin if coming from a non-admin route
      if (isAdmin && !isAdminRoute) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    } else {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/np/:path*"],
};
