"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
type Props = {
    onSignOutAction: () => Promise<void>;
};

export function SignOut({ onSignOutAction }: Props) {
    return (

        <Button
            variant="ghost" size="icon"
            onClick={() => {
                onSignOutAction();
            }}
        >
            <LogOut className="h-6 w-6" />
        </Button>
    );
}