'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import Header from '@/components/header';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('collaborator');
    const [collaboratorSettings, setCollaboratorSettings] = useState({
        minExperience: '',
        preferredTimeZone: '',
        autoApprove: false,
        maxCollaborators: '',
    });


    const handleSettingChange = (field: string, value: string | boolean) => {
        setCollaboratorSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const breadcrumbs = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Settings", href: "/dashboard/settings", active: true },
    ];

    return (
        <div className="bg-gray-50 min-h-screen w-full">
            <Header breadcrumbs={breadcrumbs} />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 flex-col">
                    {/* Custom Tab Navigation */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('collaborator')}
                                className={`${activeTab === 'collaborator'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Collaborator Requirements
                            </button>
                            <button
                                onClick={() => setActiveTab('notifications')}
                                className={`${activeTab === 'notifications'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Notifications
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'collaborator' && (
                        <div className=" rounded-lg p-6">
                            <h2 className="text-lg font-semibold mb-4">Collaborator Requirements</h2>
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Minimum Experience (years)</label>
                                    <Input
                                        type="number"
                                        value={collaboratorSettings.minExperience}
                                        onChange={(e) => handleSettingChange('minExperience', e.target.value)}
                                        placeholder="e.g., 2"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Preferred Time Zone</label>
                                    <Input
                                        type="text"
                                        value={collaboratorSettings.preferredTimeZone}
                                        onChange={(e) => handleSettingChange('preferredTimeZone', e.target.value)}
                                        placeholder="e.g., UTC-5"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Maximum Collaborators</label>
                                    <Input
                                        type="number"
                                        value={collaboratorSettings.maxCollaborators}
                                        onChange={(e) => handleSettingChange('maxCollaborators', e.target.value)}
                                        placeholder="e.g., 5"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Auto-approve Collaborators</label>
                                    <Switch
                                        checked={collaboratorSettings.autoApprove}
                                        onCheckedChange={(checked) => handleSettingChange('autoApprove', checked)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            {/* Notification Preferences Section */}
                            <div className="border rounded-lg p-6">
                                <h2 className="text-lg font-medium mb-4">Notification Preferences</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="font-medium">Email Notifications</label>
                                            <p className="text-sm text-gray-500">Receive updates via email</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="font-medium">Push Notifications</label>
                                            <p className="text-sm text-gray-500">Receive push notifications</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Notification Types Section */}
                            <div className="border rounded-lg p-6">
                                <h2 className="text-lg font-medium mb-4">Notification Types</h2>
                                <div className="space-y-4">
                                    {['New Messages', 'Mentions', 'Updates', 'Security Alerts'].map((type) => (
                                        <div key={type} className="flex items-start">
                                            <input
                                                type="checkbox"
                                                id={type.toLowerCase().replace(' ', '-')}
                                                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor={type.toLowerCase().replace(' ', '-')} className="ml-3">
                                                <div className="font-medium">{type}</div>
                                                <p className="text-sm text-gray-500">Receive notifications for {type.toLowerCase()}</p>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
