"use client"

import { useState } from "react"
import Link from "next/link"

// Mock data for physician listings
const mockListings = [
    {
        id: "1",
        title: "Family Medicine Physician",
        location: "Seattle, WA",
        type: "Full-time",
        salary: "$250,000 - $300,000",
        status: "active",
        createdAt: new Date("2024-03-15"),
    },
    {
        id: "2",
        title: "Emergency Medicine Physician",
        location: "Portland, OR",
        type: "Part-time",
        salary: "$200,000 - $250,000",
        status: "draft",
        createdAt: new Date("2024-03-14"),
    },
]

export default function ListingsPage() {
    const [listings] = useState(mockListings)

    return (
        <div className="flex-1 space-y-4">
            {listings.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="h-12 w-12 text-gray-400 mb-4">
                        📋
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                    <p className="text-gray-500 mb-4">
                        Create your first job listing to start attracting candidates.
                    </p>
                    <Link
                        href="/np/listings/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Create Listing
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {listings.map((listing) => (
                        <div
                            key={listing.id}
                            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                        >
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                        listing.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {listing.status}
                                    </span>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center text-gray-500">
                                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {listing.location}
                                    </div>
                                    <div className="flex items-center text-gray-500">
                                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {listing.type}
                                    </div>
                                    <div className="flex items-center text-gray-500">
                                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {listing.salary}
                                    </div>
                                </div>
                                
                                <div className="text-sm text-gray-500">
                                    Created: {listing.createdAt.toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
