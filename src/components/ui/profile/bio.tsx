import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Bio() {
    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Bio</CardTitle>
                <p className="text-sm text-muted-foreground">
                    This will be shown to prospective Nurse Practitioners seeking a Collaborating Physician after our matching process.
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Your Background:</label>
                    <Textarea 
                        placeholder="This is only for tour purposes of the onboarding process."
                        className="min-h-[100px]"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Board Certifications:</label>
                    <Input 
                        placeholder="Enter your board certifications"
                        defaultValue="Randy - Developer"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">LinkedIn Profile:</label>
                    <Input 
                        placeholder="Optional"
                    />
                </div>

                <div className="flex justify-end">
                    <Button variant="default">
                        Save
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
