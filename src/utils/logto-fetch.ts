import { cookies } from "next/headers";
import { EventEmitter } from 'events';

// Increase the default max listeners limit
EventEmitter.defaultMaxListeners = 25; // Adjust this number based on your application's needs

interface TokenResponse {
  access_token: string;
  // Add other token fields if needed
}

const COOKIE_TOKEN_KEY = "logtoToken";

// Cache token to avoid unnecessary token requests
let cachedToken: { value: string; expiresAt: number } | null = null;

/**
 * Makes authenticated requests to the Logto API
 * @param endpoint - The API endpoint path (without the base URL)
 * @param options - Fetch options (optional)
 * @returns Promise with the JSON response data
 * @throws {Error} If authentication token is missing or HTTP request fails
 */
export async function logtoFetch(endpoint: string, options: RequestInit = {}) {
    // Check cached token first
    if (cachedToken && cachedToken.expiresAt > Date.now()) {
        return makeAuthenticatedRequest(endpoint, cachedToken.value, options);
    }

    const cookieStore = await cookies();
    let tokenValue = cookieStore.get(COOKIE_TOKEN_KEY)?.value;

    if (!tokenValue) {
        tokenValue = await getNewToken();
    }

    return makeAuthenticatedRequest(endpoint, tokenValue, options);
}

async function getNewToken(): Promise<string> {
    if (!process.env.LOGTO_ENDPOINT || !process.env.LOGTO_API_APP_ID || 
        !process.env.LOGTO_API_APP_SECRET || !process.env.LOGTO_RESOURCE || 
        !process.env.LOGTO_SCOPE) {
        throw new Error("Missing required Logto environment variables");
    }

    const formData = new URLSearchParams({
        grant_type: "client_credentials",
        resource: process.env.LOGTO_RESOURCE,
        scope: process.env.LOGTO_SCOPE,
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
        throw new Error(`Failed to obtain token: ${tokenResponse.status}`);
    }

    const data = await tokenResponse.json() as TokenResponse & { expires_in?: number };
    
    // Cache the token with expiration (default to 1 hour if expires_in not provided)
    cachedToken = {
        value: data.access_token,
        expiresAt: Date.now() + ((data.expires_in || 3600) * 1000),
    };

    return data.access_token;
}

async function makeAuthenticatedRequest(endpoint: string, token: string, options: RequestInit) {
    try {
        const response = await fetch(`${process.env.LOGTO_ENDPOINT}api/${endpoint}`, {
            ...options,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                cachedToken = null;
                throw new Error("Unauthorized: Your session may have expired. Please log in again.");
            }
            throw new Error(`HTTP error! status: ${response.status} - ${await response.text()}`);
        }

        return response.json();
    } catch (error) {
        // Ensure we clean up on error
        cachedToken = null;
        throw error;
    }
}