import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

export default function Rates() {
    return (
        <div className="max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Update Your Rate Matrix</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        During our matching process, we will quote your base rate plus any additional fees based on your choices below.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Please be aware, adjustments in Rates may take 2-3 business days to appear in your profile for prospective Nurse Practitioners.
                    </p>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Label>Monthly Base Collaboration Rate?</Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Information about base collaboration rate</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                                <Input
                                    type="number"
                                    defaultValue="250"
                                    className="pl-7"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Label>Additional State Fee (per state)?</Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Information about state fee</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                                <Input
                                    type="number"
                                    defaultValue="100"
                                    className="pl-7"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Label>Additional Nurse Practitioner Fee? (multi-NP practices)</Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Information about NP fee</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                                <Input
                                    type="number"
                                    defaultValue="225"
                                    className="pl-7"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Label>*Optional* Controlled substances prescribing monthly fee?</Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Information about controlled substances fee</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                                <Input
                                    type="text"
                                    placeholder="Optional"
                                    className="pl-7"
                                />
                            </div>
                        </div>


                        {/* Save Button */}
                        <div className="flex justify-end">
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
