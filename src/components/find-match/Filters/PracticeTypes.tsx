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
                    <h3 className="font-medium text-foreground">Practice Types</h3>
                </div>
                {practiceTypes.length > 0 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-muted-foreground hover:text-foreground"
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
                                className="flex items-center gap-3 cursor-pointer hover:bg-muted rounded transition-colors duration-200"
                                key={practiceType._id}
                            >
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary transition-colors duration-200"
                                    checked={isPracticeTypeSelected(practiceType.type)}
                                    onChange={() => handleTogglePracticeType(practiceType.type)}
                                />
                                <span className="text-foreground">{practiceType.type}</span>
                            </label>
                        ))}
                    </div>
                    {selectedPracticeTypes.length > 0 && (
                        <button
                            onClick={handleClear}
                            className="text-muted-foreground hover:text-foreground mt-2 text-sm"
                        >
                            Clear all
                        </button>
                    )}
                </>
            )}
        </div>
    )
}
                