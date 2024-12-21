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
import { License } from "@/lib/types/onboarding";

export default function Licenses({ medicalLicenseStates, deaLicenseStates, states }: { medicalLicenseStates: License[], deaLicenseStates: string[], states: string[] }) {
    const [licenses, setLicenses] = useState<License[]>(medicalLicenseStates)
    const [dates, setDates] = useState<(Date | undefined)[]>(medicalLicenseStates.map(() => undefined))
    console.log(licenses);
    const addNewLicense = () => {
        setLicenses(prev => [...prev, { state: '', licenseNumber: '', expirationDate: null }])
        setDates(prev => [...prev, undefined])
    }

    const removeLicense = (indexToRemove: number) => {
        if (licenses.length > 1) {  // Prevent removing the last license
            setLicenses(prev => prev.filter((_, index) => index !== indexToRemove))
            setDates(prev => prev.filter((_, index) => index !== indexToRemove))
        }
    }

    console.log(deaLicenseStates);
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
                {licenses.map((license, index) => (
                    <div key={index} className="grid gap-4">
                        <div className="flex justify-between items-start">
                            <div className="grid gap-4 md:grid-cols-2 flex-1">
                                <div className="space-y-2">
                                    <label htmlFor={`state-${index}`} className="text-sm font-medium">
                                        State License #
                                    </label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select state" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {states.map((state) => (
                                                <SelectItem key={state} value={state}>{state}</SelectItem>
                                            ))}
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
                            {licenses.length > 1 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => removeLicense(index)}
                                >
                                    ✕
                                </Button>
                            )}
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
                                            !dates[index] && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon />
                                        {dates[index] ? format(dates[index]!, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" id={`exp-${index}`}>
                                    <Calendar
                                        mode="single"
                                        selected={dates[index]}
                                        onSelect={(newDate) => {
                                            setDates(prev => {
                                                const newDates = [...prev]
                                                newDates[index] = newDate
                                                return newDates
                                            })
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                ))}

                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={addNewLicense}
                    >
                        Add New License
                    </Button>
                    <Button>Save</Button>
                </div>
            </CardContent>
        </Card>
    );
}