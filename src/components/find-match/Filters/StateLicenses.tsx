'use client';

import { useEffect, useState } from "react";
import { IMedicalLicenseState } from "@/app/models/MedicalLicenseState";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function StateLicenses() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [stateLicenses, setStateLicenses] = useState<IMedicalLicenseState[]>([]);
    const [selectedStateLicenses, setSelectedStateLicenses] = useState<string[]>([]);
    const [isExpanded, setIsExpanded] = useState(true);

    const handleClear = () => {
        setSelectedStateLicenses([]);
    };

    const handleToggleStateLicense = (state: string) => {
        setSelectedStateLicenses(prevSelectedStateLicenses => prevSelectedStateLicenses.includes(state) ? prevSelectedStateLicenses.filter(s => s !== state) : [...prevSelectedStateLicenses, state]);
    };

    const isStateLicenseSelected = (state: string) => {
        return selectedStateLicenses.includes(state);
    };

    useEffect(() => {
        const fetchStateLicenses = async () => {
            const response = await fetch('/api/admin/miscellaneous/license-states');
            const data = await response.json();
            console.log(data);
            setStateLicenses(data);
        };
        fetchStateLicenses();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('stateLicense', selectedStateLicenses.join(','));
        replace(`${pathname}?${params.toString()}`);
    }, [selectedStateLicenses, searchParams, pathname, replace]);

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <h3 className="font-medium">State Licenses</h3>
                </div>
                {stateLicenses.length > 0 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label={isExpanded ? "Collapse section" : "Expand section"}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            {isExpanded ? (
                                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                            ) : (
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            )}
                        </svg>
                    </button>
                )}
            </div>
            {isExpanded && (
                <>
                    <div className="space-y-2 transition-all duration-300">
                        {stateLicenses.map((stateLicense) => (
                            <label
                                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                                key={stateLicense._id}
                            >
                                <input
                                    type="checkbox"
                                    className="rounded"
                                    checked={isStateLicenseSelected(stateLicense.state)}
                                    onChange={() => handleToggleStateLicense(stateLicense.state)}
                                />
                                <span>{stateLicense.state}</span>
                            </label>
                        ))}
                    </div>
                    {selectedStateLicenses.length > 0 && (
                        <button
                            onClick={handleClear}
                            className="text-gray-500 hover:text-gray-700 mt-2 text-sm"
                        >
                            Clear all
                        </button>
                    )}
                </>
            )}
        </div>
    )
}

