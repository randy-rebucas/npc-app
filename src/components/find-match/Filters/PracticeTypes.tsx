'use client';

import { IPracticeType } from "@/app/models/PracticeType";
import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function PracticeTypes() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    
    const [practiceTypes, setPracticeTypes] = useState<IPracticeType[]>([]); 
    const [selectedPracticeTypes, setSelectedPracticeTypes] = useState<string[]>([]);
    const [isExpanded, setIsExpanded] = useState(true);

    const handleClear = () => {
        setSelectedPracticeTypes([]);
    };

    const handleTogglePracticeType = (practiceType: string) => {
        setSelectedPracticeTypes(prevSelectedPracticeTypes => prevSelectedPracticeTypes.includes(practiceType) ? prevSelectedPracticeTypes.filter(s => s !== practiceType) : [...prevSelectedPracticeTypes, practiceType]);
    };

    const isPracticeTypeSelected = (practiceType: string) => {
        return selectedPracticeTypes.includes(practiceType);
    };

    useEffect(() => { 
        const fetchPracticeTypes = async () => {
            const response = await fetch('/api/admin/miscellaneous/practice-types');
            const data = await response.json();
            console.log(data);
            setPracticeTypes(data);
        };
        fetchPracticeTypes();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('practiceType', selectedPracticeTypes.join(','));
        replace(`${pathname}?${params.toString()}`);
    }, [selectedPracticeTypes, searchParams, pathname, replace]);

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <h3 className="font-medium">Practice Types</h3>
                </div>
                {practiceTypes.length > 0 && (
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
                        {practiceTypes.map((practiceType) => (
                            <label
                                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                                key={practiceType._id}
                            >
                                <input
                                    type="checkbox"
                                    className="rounded"
                                    checked={isPracticeTypeSelected(practiceType.type)}
                                    onChange={() => handleTogglePracticeType(practiceType.type)}
                                />
                                <span>{practiceType.type}</span>
                            </label>
                        ))}
                    </div>
                    {selectedPracticeTypes.length > 0 && (
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
                