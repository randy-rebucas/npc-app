"use client"

import { useState, useEffect } from "react";
import Script from "next/script";
import { useSession } from "next-auth/react";

interface CalendarEvent {
    id: string;
    summary: string;
    start: {
        dateTime: string;
    };
}

interface GoogleTokenResponse {
    access_token: string;
    error?: string;
}

declare global {
    interface Window {
        google: {
            accounts: {
                oauth2: {
                    initTokenClient(config: {
                        client_id: string,
                        scope: string,
                        callback: (response: { access_token: string }) => void
                    }): {
                        requestAccessToken(): void
                    }
                }
            }
        }
    }
}

export default function Calendar() {
    const { data: session } = useSession();
    const [isConnected, setIsConnected] = useState(false);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [tokenError, setTokenError] = useState<string>("");
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

    useEffect(() => {
        if (!CLIENT_ID) {
            setError("Missing Google Calendar credentials");
            setIsLoading(false);
            return;
        }
        setIsLoading(false);
    }, [CLIENT_ID]);

    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/calendar/${session?.user?.id}`);
                const accessTokenData = await response.json();

                if (accessTokenData.access_token) {
                    setIsConnected(true);
                    await fetchCalendarEvents(accessTokenData.access_token);
                }
            } catch (error) {
                console.error('Error fetching access token:', error);
                setError('Failed to fetch access token');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAccessToken();
    }, [session?.user?.id, isScriptLoaded]);

    const fetchCalendarEvents = async (token: string) => {
        try {
            setIsLoading(true);
            setError("");

            if (!token) {
                throw new Error("No access token available");
            }

            console.log("Fetching calendar events with token:", token.substring(0, 10) + "...");

            const response = await fetch(
                `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${new Date().toISOString()}&maxResults=10&orderBy=startTime&singleEvents=true`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('Calendar API Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData
                });
                throw new Error(`Calendar API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Calendar events received:", data);

            if (!data.items) {
                console.warn("No items property in response:", data);
            }

            setEvents(data.items || []);
        } catch (err) {
            console.error("Calendar fetch error:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch calendar events");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        try {
            setError("");
            setTokenError("");
            setIsLoading(true);

            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID!,
                scope: SCOPES,
                callback: async (response: GoogleTokenResponse) => {
                    if (response.error) {
                        setTokenError(`Authentication failed: ${response.error}`);
                        setIsLoading(false);
                        return;
                    }

                    if (response.access_token) {
                        console.log("Access token received:", response.access_token);
                        const tokenInfo = await fetch("/api/calendar", {
                            method: "POST",
                            body: JSON.stringify({ access_token: response.access_token, user_id: session?.user?.id }),
                        });
                        const tokenInfoData = await tokenInfo.json();
                        console.log("Token info:", tokenInfoData);
                        setIsConnected(true);
                        await fetchCalendarEvents(response.access_token);
                    } else {
                        setTokenError("No access token received");
                        setIsLoading(false);
                    }
                },
            });
            client.requestAccessToken();
        } catch (err) {
            setError("Failed to initialize Google Sign-In");
            setIsLoading(false);
            console.error(err);
        }
    };

    const handleScriptLoad = () => {
        setIsScriptLoaded(true);
    };

    const handleDisconnect = async () => {
        try {
            setIsLoading(true);
            await fetch(`/api/calendar/${session?.user?.id}`, {
                method: 'DELETE'
            });
            setIsConnected(false);
            setEvents([]);
        } catch (error) {
            console.error('Error disconnecting calendar:', error);
            setError('Failed to disconnect calendar');
        } finally {
            setIsLoading(false);
        }
    };

    return (

        <div className="p-6 max-w-2xl mx-auto">
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="lazyOnload"
                onLoad={handleScriptLoad}
            />
            <div className="rounded-lg">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Calendar</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Connect your Google Calendar to sync your schedule.
                    </p>
                </div>


                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Calendar Sync</h2>
                        {(error || tokenError) && (
                            <div className="p-4 border-l-4 border-red-500 bg-red-50 text-red-700 rounded">
                                <p>{error || tokenError}</p>
                            </div>
                        )}
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : !isConnected ? (
                            <button
                                onClick={handleGoogleSignIn}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Connect Google Calendar
                            </button>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-medium">Connected</h3>
                                    <button
                                        onClick={handleDisconnect}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                                {events?.length > 0 ? (
                                    <div className="space-y-2">
                                        {events.map((event: CalendarEvent) => (
                                            <div key={event.id} className="p-2 border rounded">
                                                <h3 className="font-medium">{event.summary}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(event.start.dateTime).toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No upcoming events</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}