'use client';

import { Notifications } from "@/components/notifications";
import { HelpMenu } from "@/components/help-menu";
import Search from "@/components/find-match/Search";
import Profile from "@/components/profile";

interface HeaderProps {
  showSearch?: boolean;
}

export default function Header({ showSearch = false }: HeaderProps) {
  return (
    <header className="w-full top-0 z-50 bg-white/90 dark:bg-gray-900/90 border-b border-gray-100 dark:border-gray-800 shadow-sm backdrop-blur-md">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
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