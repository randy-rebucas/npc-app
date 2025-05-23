'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { CircleHelp } from 'lucide-react';
import { Button } from '@/components/ui/button';
const helpItems = [
  { name: 'Documentation', href: '/docs' },
  { name: 'FAQs', href: '/np/help/faq' },
  { name: 'Support', href: '/np/help/contact-us' },
];

export function HelpMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost" size="icon"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CircleHelp className="h-6 w-6" />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {helpItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 