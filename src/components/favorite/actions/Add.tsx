"use client"

import { toast } from "@/hooks/use-toast";
import { useCallback, useEffect, useState } from "react";

export default function Add({ itemId }: { itemId: string }) {
    const [isFavorite, setIsFavorite] = useState(false);

    const fetchFavorite = useCallback(async () => {
        try {
            const favorite = await fetch(`/api/favorites/${itemId}/check`);
            const data = await favorite.json();
            setIsFavorite(data.isFavorite);
        } catch (error) {
            console.error("Error in favorite:", error);
        }
    }, [itemId]);

    useEffect(() => {
        fetchFavorite();
    }, [fetchFavorite]);

    const toggleFavorites = async (id: string) => {
        const favorite = await fetch('/api/favorites', {
            method: 'POST',
            body: JSON.stringify({ id }),
        });

        const data = await favorite.json();
        fetchFavorite();
        if (data.success) {
            toast({
                title: data.message,
                variant: 'default',
            });
        } else {
            toast({
                title: data.message,
                variant: 'destructive',
            });
        }
    }

    return (
        <button className="p-2 z-10" onClick={() => toggleFavorites(itemId)}>
            <svg xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${isFavorite ? 'text-primary' : 'text-muted-foreground'}`}
                fill={isFavorite ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </button>
    );
}
