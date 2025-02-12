"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation";

export type SimplifiedListingResponse = {
    id: string;
    title: string;
    description: string;
    boardCertification: string;
    practiceTypes: string[];
    stateLicenses: string[];
    specialties: string;
    additionalCertifications: string;
    monthlyBaseRate: number;
    multipleNPFee: number;
    additionalFeePerState: number;
    controlledSubstanceFee: number;
    status: string;
    createdAt: Date;
};

export default function ListingsPage() {
    const [listings, setListings] = useState<SimplifiedListingResponse[]>([])
    const router = useRouter();
    useEffect(() => {
        const fetchListings = async () => {
            const response = await fetch("/api/listings");
            const data = await response.json();
            setListings(data);
        }
        fetchListings();
    }, []);

    return (
        <div className="flex-1 space-y-4">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-foreground">Listings</h1>
                <Link
                    href="/np/listings/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90"
                >
                    Add Listing
                </Link>
            </div>
            {listings.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-lg bg-muted">
                    <div className="mb-4">
                        <svg
                            className="mx-auto h-12 w-12 text-muted-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <h3 className="mt-2 text-xl font-medium text-foreground">No job listings</h3>
                    <p className="mt-1 text-sm text-muted-foreground max-w-sm text-center">
                        Get started by creating your first job listing to attract qualified healthcare professionals.
                    </p>
                    <Link
                        href="/np/listings/new"
                        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        <svg
                            className="-ml-1 mr-2 h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Create New Listing
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {listings.map((listing: SimplifiedListingResponse) => (
                        <div
                            key={listing.id}
                            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                            onClick={() => router.push(`/np/listings/${listing.id}`)}
                        >
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${listing.status === 'ACTIVE'
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
                                        {listing.boardCertification} 
                                    </div>
                                    <div className="flex items-center text-gray-500">
                                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {listing.specialties}
                                    </div>
                                    <div className="flex items-center text-gray-500">
                                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {listing.monthlyBaseRate}
                                    </div>
                                </div>

                                <div className="text-sm text-gray-500">
                                    Created: {listing.createdAt.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
