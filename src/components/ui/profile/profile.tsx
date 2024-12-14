import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Profile() {
    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Profile Information</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Please make sure your information is up to date.
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    {/* Name Section */}
                    <div>
                        <label className="text-sm font-medium">Your Name</label>
                        <div className="flex gap-4 mt-1.5">
                            <Input placeholder="Name - Role" defaultValue="Randy - Developer" />
                            <Input placeholder="Details" defaultValue="Rebucas - Working with Chris Caulfield" />
                        </div>
                    </div>

                    {/* Phone Section */}
                    <div>
                        <label className="text-sm font-medium">Phone</label>
                        <p className="text-sm text-muted-foreground">We&apos;ll only call you in an emergency</p>
                        <Input className="mt-1.5" placeholder="e.g. 555-555-4444" />
                    </div>

                    {/* Address Section */}
                    <div>
                        <label className="text-sm font-medium">Address</label>
                        <div className="space-y-4 mt-1.5">
                            <Input placeholder="Address" />
                            <div className="flex gap-4">
                                <Input placeholder="City" />
                                <Input placeholder="State" />
                                <Input placeholder="ZIP" />
                            </div>
                        </div>
                    </div>

                    {/* Email Section */}
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <div className="flex items-center gap-4 mt-1.5">
                            <Input 
                                defaultValue="rebucasrandy1984@gmail.com" 
                                readOnly
                                className="bg-muted"
                            />
                            <Button variant="outline">
                                Change Email Address
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button>Save</Button>
                </div>
            </CardContent>
        </Card>
    );
}