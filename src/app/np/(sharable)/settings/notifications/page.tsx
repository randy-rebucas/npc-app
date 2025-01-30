export default function NotificationsPage() {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
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
    )
}
