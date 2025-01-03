'use client';

import { IAttestation } from '@/app/models/Attestation';
import Header from '@/components/header';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AttestationsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [attestations, setAttestations] = useState<IAttestation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Add data fetching
    useEffect(() => {
        const fetchAttestations = async () => {
            try {
                const response = await fetch('/api/attestations');
                if (!response.ok) throw new Error('Failed to fetch attestations');
                const data = await response.json();
                console.log(data);
                setAttestations(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchAttestations();
    }, []);

    // Add search filter
    const filteredAttestations = attestations.filter((attestation) =>
        Object.values(attestation).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Add loading state
    if (loading) {
        return <div className="flex justify-center p-8">Loading attestations...</div>;
    }

    // Add error handling
    if (error) {
        return <div className="text-red-500 p-8">Error: {error}</div>;
    }

    const breadcrumbs = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Attestations", href: "/dashboard/attestations", active: true },
    ];

    return (
        <div className="bg-gray-50 min-h-screen w-full">
            <Header breadcrumbs={breadcrumbs} />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 flex-col space-y-8 p-8">
                    <div className="flex items-center justify-between space-y-2">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Attestations</h2>
                            <p className="text-muted-foreground">
                                Manage your attestations here!
                            </p>
                        </div>
                    </div>


                    <div className="space-y-6">
                        <div className="mb-4 flex justify-between items-center">
                            <input
                                type="text"
                                placeholder="Search attestations..."
                                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Link
                                href="/dashboard/attestations/create"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Create Attestation
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Schema
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Recipient
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Attester
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Timestamp
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredAttestations.map((attestation) => (
                                        <tr key={attestation._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {attestation.schema}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {attestation.recipient}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {attestation.attester}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {attestation.timestamp}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${attestation.status === 'verified'
                                                        ? 'bg-green-100 text-green-800'
                                                        : attestation.status === 'rejected'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                        }`}
                                                >
                                                    {attestation.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Link
                                                    href={`/dashboard/attestations/${attestation._id}`}
                                                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredAttestations.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-4">
                                                    <div className="text-gray-400">
                                                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-gray-500 text-lg font-medium">No attestations found</div>
                                                    <p className="text-gray-400 text-sm">
                                                        {searchTerm
                                                            ? "Try adjusting your search terms or clear the search"
                                                            : "Get started by creating your first attestation"}
                                                    </p>
                                                    {!searchTerm && (
                                                        <Link
                                                            href="/dashboard/attestations/create"
                                                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                                        >
                                                            Create Attestation
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

