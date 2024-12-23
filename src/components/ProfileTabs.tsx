'use client';

import { useState } from 'react';

export default function ProfileTabs({ tabs, content }: { tabs: string[], content: React.ReactNode[] }) {
    const [activeTab, setActiveTab] = useState<string>('profile');

    return (
        <div className="bg-white rounded-lg shadow">
            <nav className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`
                            flex-1 py-4 px-1 text-center border-b-2 
                            ${activeTab === tab.toLowerCase()
                                ? 'border-blue-500 text-blue-600 font-medium'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                        `}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                    >
                        {tab}
                    </button>
                ))}
            </nav>
            <div className="p-6">
                {content[tabs.findIndex(tab => tab.toLowerCase() === activeTab)]}
            </div>
        </div>
    );
} 