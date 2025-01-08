'use client';
import Link from "next/link";


export default function HelpPage() {
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Help Center</h1>
            
            {/* Search Bar */}
            <div className="mb-6">
                <input 
                    type="text" 
                    placeholder="Search for help..." 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Links Section */}
            <div className="flex flex-col gap-6 mb-6">
                <Link href="/dashboard/help/faq" className="text-lg font-medium text-blue-600 hover:text-blue-800 transition duration-300">
                    FAQ
                </Link>
                <Link href="/dashboard/help/contactus" className="text-lg font-medium text-blue-600 hover:text-blue-800 transition duration-300">
                    Contact Us
                </Link>
            </div>

            {/* Popular Articles */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Popular Articles</h2>
                <ul className="list-disc list-inside">
                    <li><Link href="/dashboard/help/article1" className="text-blue-600 hover:text-blue-800">How to reset your password</Link></li>
                    <li><Link href="/dashboard/help/article2" className="text-blue-600 hover:text-blue-800">Setting up two-factor authentication</Link></li>
                    <li><Link href="/dashboard/help/article3" className="text-blue-600 hover:text-blue-800">Managing your account settings</Link></li>
                </ul>
            </div>

            {/* Feedback Form */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Feedback</h2>
                <form>
                    <textarea 
                        placeholder="Let us know how we can improve..." 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        rows={4}
                    ></textarea>
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300">
                        Submit Feedback
                    </button>
                </form>
            </div>
        </div>
    );
}