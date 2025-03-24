"use client";

import { LogOut } from "lucide-react";

type Props = {
    onSignOut: () => Promise<void>;
};

export function SignOut({ onSignOut }: Props) {
    return (
        <button
            onClick={() => {
                onSignOut();
            }}
            aria-label="Sign out"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full relative"
        >
            <LogOut className="h-6 w-6" />
        </button>
    );
}