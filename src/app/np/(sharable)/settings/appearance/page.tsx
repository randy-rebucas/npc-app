'use client';

import { useState, FormEvent } from 'react';

export default function AppearancePage() {
    const [formData, setFormData] = useState({
        theme: 'system',
        fontSize: 'normal',
        reducedMotion: false
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // TODO: Implement save logic
        console.log('Saving settings:', formData);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
                {/* Theme Selection */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Theme</h2>
                    <div className="space-y-2">
                        {['light', 'dark', 'system'].map((option) => (
                            <label key={option} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="theme"
                                    value={option}
                                    checked={formData.theme === option}
                                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                    className="w-4 h-4"
                                />
                                <span className="capitalize">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Font Size */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Font Size</h2>
                    <div className="space-y-2">
                        {['small', 'normal', 'large'].map((size) => (
                            <label key={size} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="fontSize"
                                    value={size}
                                    checked={formData.fontSize === size}
                                    onChange={(e) => setFormData({ ...formData, fontSize: e.target.value })}
                                    className="w-4 h-4"
                                />
                                <span className="capitalize">{size}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 
                                 rounded-lg transition-colors duration-200"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
