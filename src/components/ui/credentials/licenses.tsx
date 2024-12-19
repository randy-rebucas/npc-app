'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { format } from "date-fns"

export type License = {
    state: string;
    licenseNumber: string;
    expirationDate: Date;
}

export default function Licenses({ licenses }: { licenses: License[] }) {
    const [date, setDate] = useState<Date>()
    console.log(licenses);
    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">License Information</CardTitle>
                <p className="text-sm text-muted-foreground">
                    License verification is checked prior to all collaboration initiations. Please make sure your information is up to date.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                    <span className="font-medium">*NP Collaborator</span> is currently serving{" "}
                    <span className="font-medium">NJ, MI, OH, TX</span> - We&apos;ll be expanding to additional states very soon.
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="grid gap-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor={`state-${index}`} className="text-sm font-medium">
                                    State License #
                                </label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="nj">New Jersey</SelectItem>
                                        <SelectItem value="mi">Michigan</SelectItem>
                                        <SelectItem value="oh">Ohio</SelectItem>
                                        <SelectItem value="tx">Texas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor={`license-${index}`} className="text-sm font-medium">
                                    License #
                                </label>
                                <Input
                                    id={`license-${index}`}
                                    placeholder="Enter license number"
                                />
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <label htmlFor={`exp-${index}`} className="text-sm font-medium">
                                Exp. Date
                            </label>

                            <Popover>
                                <PopoverTrigger asChild id={`exp-${index}`}>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[280px] justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" id={`exp-${index}`}>
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                ))}

                <div className="flex justify-end">
                    <Button>Save</Button>
                </div>
            </CardContent>
        </Card>
    );
}