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
                <h1 className="text-2xl font-bold mb-6">Attestations</h1>


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
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            No attestations found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </main>
        </div>
    );
}

