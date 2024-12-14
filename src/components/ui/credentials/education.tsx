import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Education() {
    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Degree</CardTitle>
                <p className="text-sm text-muted-foreground">
                    This will be shown to prospective Nurse Practitioners seeking a Collaborating Physician
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="clinicalDegree">Clinical Degree Type:</Label>
                        <Input
                            id="clinicalDegree"
                            placeholder="MD"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold">Education</h2>
                            <Button variant="default">Save</Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Tell us more about your education
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="undergrad">Undergrad Institution:</Label>
                        <Input
                            id="undergrad"
                            placeholder="Enter your undergraduate institution"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="medical">Medical Degree Institution:</Label>
                        <Input
                            id="medical"
                            placeholder="Enter your medical school"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="residency">Residency Program:</Label>
                        <Input
                            id="residency"
                            placeholder="Enter your residency program"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}