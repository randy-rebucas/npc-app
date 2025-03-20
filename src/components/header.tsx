'use client';

import { Notifications } from "@/components/notifications";
import { HelpMenu } from "@/components/help-menu";
import Search from "@/components/find-match/Search";
import Profile from "@/components/profile";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/providers/logto-session-provider";

interface HeaderProps {
  showSearch?: boolean;
}

export default function Header({ showSearch = false }: HeaderProps) {
  const { user, isAuthenticated } = useSession(); 

  return (
    <header className="w-full top-0 z-50 bg-background/90 border-b border-border shadow-sm backdrop-blur-md">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/np">
              <Image src="/logo-black.png" alt="Logo" width={100} height={100} />
            </Link>
            {showSearch && (
              <Search placeholder="Search for a match" /> 
            )}
          </div>
          <div className="flex items-center gap-6">
            <HelpMenu />
            <Notifications />
            <Profile /> 
          </div>
        </div>
      </nav>
    </header>
  );
}