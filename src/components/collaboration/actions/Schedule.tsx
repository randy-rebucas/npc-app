'use client'

import { toast } from "@/hooks/use-toast";
import { loadCalendlyScript } from "@/lib/calendly";
import { useEffect } from "react";

export default function Schedule({ calendlyLink }: { calendlyLink: string }) {
    useEffect(() => {
        loadCalendlyScript();
    }, []);

    const scheduleInterview = (calendlyLink: string) => {
        console.log('calendlyLink', calendlyLink);
        if (window.Calendly) {
            if (calendlyLink === '' || calendlyLink === null) {
                toast({
                    title: 'Calendly link is not setup',
                    variant: 'destructive',
                });
            } else {
                window.Calendly.initPopupWidget({
                    url: calendlyLink
                });
            }
        }
    };
    
    return (
        <button
            onClick={() => scheduleInterview(calendlyLink)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-lg transition-colors"
        >
            Schedule Interview
        </button>
    )
}
