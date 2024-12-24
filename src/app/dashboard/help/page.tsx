import Header from "@/components/header";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Help',
 };

export default async function HelpPage() {
    return (
        <div className="bg-gray-50 min-h-screen w-full">
            <Header breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Help', href: '/dashboard/help', active: true },
            ]} />

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">

                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Help Center</h1>
                    {/* Contact Section */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                        <div className="border-b pb-4">
                            <h2 className="text-2xl font-semibold text-gray-900">Contact Us</h2>
                            <p className="text-gray-500 mt-1">Need Help or Have Feedback?</p>
                        </div>

                        <div className="space-y-4">
                            {/* Contact Card */}
                            <div className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-500 transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-50">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Contact us</h3>
                                    <p className="text-gray-500">Can ask us for any help</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-sm">
                                    @
                                </div>
                            </div>

                            {/* Report Issue Card */}
                            <div className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-red-500 transition-all cursor-pointer hover:shadow-lg hover:shadow-red-50">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Report an issue</h3>
                                    <p className="text-gray-500">Let us know of any bug</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-sm">
                                    🐞
                                </div>
                            </div>

                            {/* Feature Request Card */}
                            <div className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-green-500 transition-all cursor-pointer hover:shadow-lg hover:shadow-green-50">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Request a feature</h3>
                                    <p className="text-gray-500">Tell us about new features</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                                    NEW
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}