import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Certifications() {
    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Certifications</CardTitle>
                <p className="text-sm text-muted-foreground">
                    This will be shown to prospective Nurse Practitioners seeking a Collaborating Physician
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Board Certifications:</label>
                    <Input 
                        placeholder="Randy - Developer"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Additional Certifications:</label>
                    <Input 
                        placeholder="Optional"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">NPI#</label>
                        <Button variant="default">Save</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Please don&apos;t adjust this number after approved.
                    </p>
                    <Input 
                        placeholder="123456789"
                    />
                </div>
            </CardContent>
        </Card>
    );
}