'use client'

import { toast } from '@/hooks/use-toast';
import { useCallback, useState } from 'react';
import { useEffect } from 'react';

export default function Favorite({ id }: { id: string }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const fetchFavorite = useCallback(async () => {
        try {
            const favorite = await fetch(`/api/favorites/${id}/check`);
            const data = await favorite.json();
            setIsFavorite(data.isFavorite);
        } catch (error) {
            console.error("Error in favorite:", error);
        }
    }, [id]);

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
        <button onClick={() => toggleFavorites(id)} className={`w-full bg-white hover:bg-gray-50 py-3 px-4 rounded-lg transition-colors border ${isFavorite ? '' : 'text-blue-600 border-blue-600text-red-600 border -red-600'}`}>
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
    )
}