import Results from "@/components/find-match/Results";
import Sort from "@/components/find-match/Sort";

import Pagination from "@/components/ui/member/pagination";
import { SearchParams } from "@/lib/types/search-params";
import Price from "@/components/find-match/Filters/Price";
import StateLicenses from "@/components/find-match/Filters/StateLicenses";
import PracticeTypes from "@/components/find-match/Filters/PracticeTypes";
import { Suspense } from "react";
import { ResultsSkeleton } from "@/components/skeletons";
import { getListings } from "@/app/actions/listing";


export type SimplifiedListingResponse = {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    title: string;
    description: string;
    boardCertification: string;
    practiceTypes: string[];
    stateLicenses: string[];
    specialties: string;
    monthlyBaseRate: number;
    multipleNPFee: number;
    additionalFeePerState: number;
    controlledSubstanceFee: number;
    status: string;
    profile: {
        firstName?: string;
        lastName?: string;
        profilePhotoPath?: string;
    };
};


export default async function FindMatch(props: {
    searchParams: SearchParams
}) {
    const ITEMS_PER_PAGE = 10;
    const params = await props.searchParams;
    // search params
    const query = String(params?.query || '');
    // page
    const currentPage = Number(params?.page) || 1;

    const sort = params?.sort as 'lowest_price' | 'highest_price' | 'most_recent' | undefined;
    // filters
    const stateLicense = params?.stateLicense as string | undefined;
    const practiceType = params?.practiceType as string | undefined;
    const priceRange = params?.priceRange as string | undefined;
    // get users
    const { listings, total }: { listings: SimplifiedListingResponse[], total: number } = await getListings({
        page: currentPage,
        search: query,
        limit: ITEMS_PER_PAGE,
        sort: sort,
        stateLicense: stateLicense,
        practiceType: practiceType,
        priceRange: priceRange
    });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(startItem + ITEMS_PER_PAGE - 1, total);

    return (

        <div className="flex gap-8">
            {/* Filters Sidebar */}
            <div className="w-64 flex-shrink-0">
                {/* Practice Types */}
                <PracticeTypes />

                {/* State Licenses */}
                <StateLicenses />

                {/* Price Range */}
                <Price />
            </div>
            {/* Results */}
            <div className="flex flex-1 flex-col">
                <Sort counts={total} />

                <Suspense fallback={<ResultsSkeleton />}>
                    <Results results={listings} />
                </Suspense>

                <Pagination
                    startItem={startItem}
                    endItem={endItem}
                    totalItems={total}
                    currentPage={currentPage}
                    query={query}
                    totalPages={totalPages}
                />
            </div>
        </div>

    );
}