'use client';

import Image from "next/image";
import Link from "next/link";
import Add from "@/components/favorite/actions/Add";
import { useEffect, useState } from "react";

export interface Result {
    id: string;
    description: string;
    practiceTypes: string[];
    monthlyBaseRate: number;
    profile: {
        firstName?: string;
        lastName?: string;
        profilePhotoPath?: string;
    };
}

export default function Results({ results }: { results: Result[] }) {
    const [favorites, setFavorites] = useState<Result[]>([]);

    useEffect(() => {
        setFavorites(results);
    }, [results]);

    console.log(favorites);

    if (results.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2 text-foreground">No matches found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 mb-6">
            {/* Result Cards */}
            {favorites.map((result) => (
                <div key={result.id} className="flex gap-4 border border-border rounded-lg p-4 hover:shadow-lg transition-shadow bg-card">
                    <div className="w-40 h-40">
                        <Image src={result.profile?.profilePhotoPath || ''} alt={result.profile?.firstName || ''} sizes="100vw"
                            width={100}
                            height={100}
                            style={{
                                width: '100%',
                                height: 'auto',
                            }} className="rounded-md" />
                    </div>
                    <div className="flex-grow">
                        <div className="flex justify-between items-start">
                            <h2 className="text-xl font-semibold text-foreground">
                                <Link href={`/np/find-match/${result.id}`} className="hover:underline">
                                    {result.profile?.firstName} {result.profile?.lastName}
                                </Link>
                            </h2>
                            <Add itemId={result.id} />
                        </div>
                        <div className="text-lg font-medium mb-2 text-foreground">Total Price: ${result.monthlyBaseRate}</div>
                        <div className="text-muted-foreground mb-1">{result.practiceTypes.join(', ')}</div>
                        <div className="text-muted-foreground line-clamp-2">
                            {result?.description}
                        </div>
                        <div className="flex justify-end">
                            <Link href={`/np/find-match/${result.id}`} className="text-primary hover:underline">View Profile</Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
