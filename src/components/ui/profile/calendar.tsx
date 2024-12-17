"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Script from "next/script";

interface GoogleUser {
    // Add properties as needed
    id: string;
}

interface CalendarListParams {
    calendarId: string;
    timeMin: string;
    showDeleted: boolean;
    singleEvents: boolean;
    maxResults: number;
    orderBy: string;
}

interface CalendarResponse {
    result: {
        items: Array<CalendarEvent>;
    };
}

interface CalendarEvent {
    id: string;
    summary: string;
    start: {
        dateTime: string;
    };
}

interface GoogleApiInitParams {
    apiKey: string;
    clientId: string;
    discoveryDocs: string[];
    scope: string;
}

declare global {
    interface Window {
        gapi: {
            load(
                apiName: string,
                callback: () => void
            ): void;
            auth2: {
                getAuthInstance(): {
                    signIn(): Promise<GoogleUser>;
                    isSignedIn: {
                        get(): boolean;
                    };
                };
            };
            client: {
                calendar: {
                    events: {
                        list(params: CalendarListParams): Promise<CalendarResponse>;
                    };
                };
                init(params: GoogleApiInitParams): Promise<void>;
            };
        };
    }
}

export default function Calendar() {
    const [isConnected, setIsConnected] = useState(false);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Add your Google Client ID from Google Cloud Console
    const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
    const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

    useEffect(() => {
        if (!CLIENT_ID || !API_KEY) {
            setError("Missing Google Calendar credentials");
            setIsLoading(false);
            return;
        }

        const initializeGoogleAPI = () => {
            window.gapi.load('client:auth2', async () => {
                try {
                    await window.gapi.client.init({
                        apiKey: API_KEY,
                        clientId: CLIENT_ID,
                        discoveryDocs: [DISCOVERY_DOC],
                        scope: SCOPES,
                    });
                    
                    // Check if already signed in
                    if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
                        setIsConnected(true);
                        await fetchCalendarEvents();
                    }
                } catch (err) {
                    setError("Failed to initialize Google Calendar API");
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            });
        };

        const script = document.querySelector('script[src="https://apis.google.com/js/api.js"]');
        if (script) {
            initializeGoogleAPI();
        }
    }, []);

    const handleGoogleSignIn = async () => {
        try {
            const response = await window.gapi.auth2.getAuthInstance().signIn();
            if (response) {
                setIsConnected(true);
                await fetchCalendarEvents();
            }
        } catch (err) {
            setError("Failed to connect to Google Calendar");
            console.error(err);
        }
    };

    const fetchCalendarEvents = async () => {
        try {
            const response = await window.gapi.client.calendar.events.list({
                'calendarId': 'primary',
                'timeMin': (new Date()).toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 10,
                'orderBy': 'startTime'
            });
            setEvents(response.result.items as CalendarEvent[]);
        } catch (err) {
            setError("Failed to fetch calendar events");
            console.error(err);
        }
    };

    const handleScriptLoad = () => {
        if (typeof window.gapi !== 'undefined') {
            window.gapi.load('client:auth2', () => {});
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Script 
                src="https://apis.google.com/js/api.js" 
                onLoad={handleScriptLoad}
                strategy="lazyOnload"
            />
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Calendar</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Connect your Google Calendar to sync your schedule.
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Calendar Sync</h2>
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            {isLoading ? (
                                <p>Loading...</p>
                            ) : !isConnected ? (
                                <Button onClick={handleGoogleSignIn}>
                                    Connect Google Calendar
                                </Button>
                            ) : (
                                <div className="space-y-4">
                                    <Alert variant="default" className="bg-green-50">
                                        <InfoIcon className="h-4 w-4" />
                                        <AlertDescription>Calendar connected successfully!</AlertDescription>
                                    </Alert>
                                    {events.length > 0 ? (
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
                </CardContent>
            </Card>
        </div>
    );
}
