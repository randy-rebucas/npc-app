import Link from "next/link";

export default function ContactUsPage() {
    return (
        <div className="max-w-2xl mx-auto">
  
            {/* Contact Section */}
            <div className="bg-white p-6 space-y-6">
                <div className="border-b pb-4">
                    <h2 className="text-2xl font-semibold text-gray-900">Contact Us</h2>
                    <p className="text-gray-500 mt-1">Need Help or Have Feedback?</p>
                </div>

                <div className="space-y-4">
                    {/* Contact Card */}
                    <Link href="/dashboard/help/contact" className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-500 transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-50">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Contact us</h3>
                            <p className="text-gray-500">Can ask us for any help</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-sm">
                            @
                        </div>
                    </Link>

                    {/* Report Issue Card */}
                    <Link href="/dashboard/help/report" className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-red-500 transition-all cursor-pointer hover:shadow-lg hover:shadow-red-50">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Report an issue</h3>
                            <p className="text-gray-500">Let us know of any bug</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-sm">
                            🐞
                        </div>
                    </Link>

                    {/* Feature Request Card */}
                    <Link href="/dashboard/help/feature" className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-green-500 transition-all cursor-pointer hover:shadow-lg hover:shadow-green-50">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Request a feature</h3>
                            <p className="text-gray-500">Tell us about new features</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                            NEW
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}