'use client';
import Link from "next/link";


export default function HelpPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Help Center</h1>
            <div className="flex flex-col gap-4">
                <Link href="/dashboard/help/faq" className="text-lg font-semibold text-gray-900">FAQ</Link>
                <Link href="/dashboard/help/contactus" className="text-lg font-semibold text-gray-900">Contact Us</Link>
            </div>
        </div>
    );
}