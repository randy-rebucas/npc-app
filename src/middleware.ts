import { NextResponse, NextRequest } from "next/server";
import { logtoConfig } from "./app/logto";
import { getLogtoContext } from "@logto/next/server-actions";
import { cookies } from "next/headers";

interface CustomClaims {
  role?: "admin" | "user" | "physician" | "nurse-practitioner";
}

async function getLogtoToken() {
  console.log("Getting Logto token...");
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
    console.log("Token set in cookie:", data.access_token);
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
    console.log("Fetching custom claims...");
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
    console.log("Custom claims fetched:", data);
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
      return NextResponse.redirect(new URL("/", req.url));
    }

    const logtoToken = await getLogtoToken();
    if (!logtoToken) {
      console.error("Failed to obtain Logto token for user:", claims.sub);
      return NextResponse.redirect(new URL("/", req.url));
    }

    const customClaims = await getCustomClaims(claims.sub, logtoToken);
    if (!customClaims) {
      console.error("Failed to fetch custom claims for user:", claims.sub);
      return NextResponse.redirect(new URL("/", req.url));
    }

    // If user hasn't completed onboarding (no role assigned)
    if (!customClaims.hasOwnProperty("role")) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isAdmin = customClaims.role === "admin";

    // Handle route access
    if (isAdminRoute && !isAdmin) {
      console.warn(`Unauthorized admin access attempt by user ${claims.sub}`);
      // if (customClaims.role === "physician") {
      //   console.log("Redirecting physician to NP main");
      //   return NextResponse.redirect(new URL("/np/main", req.url));
      // } else if (customClaims.role === "nurse-practitioner") {
      //   console.log("Redirecting NP to NP find match");
      //   return NextResponse.redirect(new URL("/np/find-match", req.url));
      // } else {
        console.log("Redirecting to NP");
        return NextResponse.redirect(new URL("/np", req.url));
      // }
    }

    if (!isAdminRoute && isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

// Define the config for the middleware
export const config = {
  matcher: ["/admin/:path*", "/np/:path*"],
};
