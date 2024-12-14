import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function GovID() {
    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Government ID</CardTitle>
                <CardDescription>
                    Your record of upload of your Government Issue ID.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-muted-foreground">Gov ID Status:</p>
                    </div>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                        Document Uploaded
                    </Badge>
                    <Button variant="default">
                        Save
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}