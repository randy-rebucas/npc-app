import { NextResponse, NextRequest } from "next/server";
import { logtoConfig } from "./app/logto";
import { getLogtoContext } from "@logto/next/server-actions";
import { cookies } from "next/headers";

// Improved type definitions
type Role = "admin" | "user" | "physician" | "nurse-practitioner";

interface CustomClaims {
  role?: Role;
}

interface TokenResponse {
  access_token: string;
  // Add other token fields if needed
}

// Constants
const COOKIE_TOKEN_KEY = "logtoToken";
const ROUTES = {
  HOME: "/",
  ONBOARDING: "/onboarding",
  ADMIN_DASHBOARD: "/admin/dashboard",
  NP_MAIN: "/np/main",
  NP_FIND_MATCH: "/np/find-match",
  NP: "/np",
} as const;

// Utility function to create redirect response
const redirectTo = (req: NextRequest, path: string) => {
  return NextResponse.redirect(new URL(path, req.url));
};

async function getLogtoToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const existingToken = cookieStore.get(COOKIE_TOKEN_KEY);

  if (existingToken?.value) {
    return existingToken.value;
  }

  try {
    const formData = new URLSearchParams({
      grant_type: "client_credentials",
      resource: process.env.LOGTO_RESOURCE ?? "",
      scope: process.env.LOGTO_SCOPE ?? "",
    });

    if (!process.env.LOGTO_ENDPOINT || !process.env.LOGTO_API_APP_ID || !process.env.LOGTO_API_APP_SECRET) {
      throw new Error("Missing required Logto environment variables");
    }

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

    const data = await tokenResponse.json() as TokenResponse;
    cookieStore.set(COOKIE_TOKEN_KEY, data.access_token);
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
  if (!process.env.LOGTO_ENDPOINT) {
    console.error("Missing LOGTO_ENDPOINT environment variable");
    return null;
  }

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
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json() as CustomClaims;
  } catch (error) {
    console.error("Error fetching custom claims:", error);
    return null;
  }
}

// Role-based redirect logic
function getRoleBasedRedirect(req: NextRequest, role: Role | undefined): NextResponse {
  switch (role) {
    case "physician":
      return redirectTo(req, ROUTES.NP_MAIN);
    case "nurse-practitioner":
      return redirectTo(req, ROUTES.NP_FIND_MATCH);
    case "admin":
      return redirectTo(req, ROUTES.ADMIN_DASHBOARD);
    default:
      return redirectTo(req, ROUTES.NP);
  }
}

export async function middleware(req: NextRequest) {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);

    if (!isAuthenticated || !claims?.sub) {
      return redirectTo(req, ROUTES.HOME);
    }

    const logtoToken = await getLogtoToken();
    if (!logtoToken) {
      console.error("Failed to obtain Logto token for user:", claims.sub);
      return redirectTo(req, ROUTES.HOME);
    }

    const customClaims = await getCustomClaims(claims.sub, logtoToken);
    if (!customClaims) {
      console.error("Failed to fetch custom claims for user:", claims.sub);
      return redirectTo(req, ROUTES.HOME);
    }

    if (!customClaims.role) {
      return redirectTo(req, ROUTES.ONBOARDING);
    }

    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isAdmin = customClaims.role === "admin";

    // Handle route access
    if (isAdminRoute && !isAdmin) {
      console.warn(`Unauthorized admin access attempt by user ${claims.sub}`);
      return getRoleBasedRedirect(req, customClaims.role);
    }

    if (!isAdminRoute && isAdmin) {
      return redirectTo(req, ROUTES.ADMIN_DASHBOARD);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return redirectTo(req, ROUTES.HOME);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/np/:path*"],
};
