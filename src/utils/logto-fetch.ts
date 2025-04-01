import { cookies } from "next/headers";
import { EventEmitter } from 'events';

EventEmitter.defaultMaxListeners = 15; // or any higher number that makes sense for your application

/**
 * Makes authenticated requests to the Logto API
 * @param endpoint - The API endpoint path (without the base URL)
 * @param options - Fetch options (optional)
 * @returns Promise with the JSON response data
 * @throws {Error} If authentication token is missing or HTTP request fails
 */
export async function logtoFetch(endpoint: string, options: RequestInit = {}) {
    const cookieStore = await cookies();
    const logtoToken = cookieStore.get("logtoToken");

    if (!logtoToken?.value) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`${process.env.LOGTO_ENDPOINT}api/${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${logtoToken.value}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    console.log(response);
  
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized: Your session may have expired. Please log in again.");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    return data;
  }