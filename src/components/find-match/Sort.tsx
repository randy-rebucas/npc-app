"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Sort({ counts }: { counts: number }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const sort = searchParams.get('sort') || 'lowest_price';

    const onChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', value);
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex justify-between items-center mb-4">
            <div className="text-foreground">{counts} results</div>
            <div className="flex items-center gap-2">
                <span className="text-foreground">Sort by:</span>
                <select 
                    className="border border-border rounded-md p-2 bg-background text-foreground" 
                    value={sort} 
                    onChange={(e) => onChange(e.target.value)}
                >
                    <option value="lowest_price">Lowest price</option>
                    <option value="highest_price">Highest price</option>
                    <option value="most_recent">Most recent</option>
                </select>
            </div>
        </div>
    );
}
