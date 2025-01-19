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
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Price Range</h3>
                <button
                    onClick={handleClear}
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                    Reset
                </button>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="number"
                            value={priceRange[0]}
                            onChange={handleMinChange}
                            className="w-full pl-8 pr-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Min"
                            min="0"
                        />
                    </div>
                    <span className="text-gray-400">to</span>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="number"
                            value={priceRange[1]}
                            onChange={handleMaxChange}
                            className="w-full pl-8 pr-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        min="0"
                        max="1000"
                        step="10"
                    />
                </div>

                <div className="flex justify-between text-sm text-gray-500">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                </div>
            </div>
        </div>
    );
}