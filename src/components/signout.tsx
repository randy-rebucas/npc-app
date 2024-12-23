"use client";

import { signOut } from "next-auth/react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export function SignOut() {
    return (
        <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            aria-label="Sign out"
        >
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
        </button>
    );
}