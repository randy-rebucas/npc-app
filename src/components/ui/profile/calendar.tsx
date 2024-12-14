import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function Calendar() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Calendar</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Please make sure your Google Calendar is synced.
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Calendar Sync</h2>
                            <Alert variant="default" className="bg-muted">
                                <InfoIcon className="h-4 w-4" />
                                <AlertDescription>** Coming Soon **</AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
