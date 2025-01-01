"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOut() {
    return (
        <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            aria-label="Sign out"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full relative"
        >
            <LogOut className="h-6 w-6" />
        </button>
    );
}