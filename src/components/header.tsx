'use client';

import { SignOut } from "./signout";
import { Notifications } from "@/components/notifications";
import { HelpMenu } from "@/components/help-menu";
import Link from "next/link";
// import { Chat } from "@/components/chat";

export default function Header() {
  return (
    <header className="w-full top-0 z-50 bg-white/90 dark:bg-gray-900/90 border-b border-gray-100 dark:border-gray-800 shadow-sm backdrop-blur-md">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* <Breadcrumbs breadcrumbs={breadcrumbs} /> */}
          <Link href="/np" className="text-lg font-bold">NP</Link>
          <div className="flex items-center gap-4">
            {/* <Chat /> */}
            <HelpMenu />
            <Notifications />
            <SignOut />
          </div>
        </div>
      </nav>
    </header>
  );
}