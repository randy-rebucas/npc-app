'use client'

import { useEffect, useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Price() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(Number(e.target.value), priceRange[1]);
        setPriceRange([value, priceRange[1]]);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(e.target.value), priceRange[0]);
        setPriceRange([priceRange[0], value]);
    };

    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        // Update the range that's being dragged
        const isMinThumb = Math.abs(value - priceRange[0]) < Math.abs(value - priceRange[1]);
        setPriceRange(isMinThumb ? [value, priceRange[1]] : [priceRange[0], value]);
    };

    const handleClear = () => {
        setPriceRange([0, 1000]);
    };

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('priceRange', priceRange.join(','));
        replace(`${pathname}?${params.toString()}`);
    }, [priceRange, searchParams, pathname, replace]);

    return (
        <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Price Range</h3>
                <button
                    onClick={handleClear}
                    className="text-sm text-primary hover:text-primary/90 transition-colors"
                >
                    Reset
                </button>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <input
                            type="number"
                            value={priceRange[0]}
                            onChange={handleMinChange}
                            className="w-full pl-8 pr-3 py-2 rounded-md border border-border focus:border-primary focus:ring-1 focus:ring-primary bg-background text-foreground"
                            placeholder="Min"
                            min="0"
                        />
                    </div>
                    <span className="text-muted-foreground">to</span>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <input
                            type="number"
                            value={priceRange[1]}
                            onChange={handleMaxChange}
                            className="w-full pl-8 pr-3 py-2 rounded-md border border-border focus:border-primary focus:ring-1 focus:ring-primary bg-background text-foreground"
                            placeholder="Max"
                            min="0"
                        />
                    </div>
                </div>

                <div className="px-1">
                    <input
                        type="range"
                        value={priceRange[1]}
                        onChange={handleRangeChange}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        min="0"
                        max="1000"
                        step="10"
                    />
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                </div>
            </div>
        </div>
    );
}