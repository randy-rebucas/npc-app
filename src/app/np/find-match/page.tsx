import { IUserProfile } from "@/app/models/UserProfile";
import { IStripeAccount } from "@/app/models/StripeAccount";
import Results from "@/components/find-match/Results";
import Sort from "@/components/find-match/Sort";
import Header from "@/components/header";
import Pagination from "@/components/ui/member/pagination";
import { SearchParams } from "@/lib/types/search-params";
import { getNpUsers } from "@/app/actions/user";
import Price from "@/components/find-match/Filters/Price";
import StateLicenses from "@/components/find-match/Filters/StateLicenses";
import PracticeTypes from "@/components/find-match/Filters/PracticeTypes";

export type SimplifiedUserResponse = {
    id: string;
    username: string;
    email: string;
    role: string;
    provider: string;
    createdAt: Date;
    onBoardingStatus: string;
    metaData?: {
        [key: string]: string;
    };
    profile?: IUserProfile;
    stripeaccount?: IStripeAccount;
    submissionStatus: string;
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

    // get users
    const { users, total }: { users: SimplifiedUserResponse[], total: number } = await getNpUsers({
        page: currentPage,
        search: query,
        limit: ITEMS_PER_PAGE,
        sort: sort,
        stateLicense: stateLicense,
        practiceType: practiceType
    });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(startItem + ITEMS_PER_PAGE - 1, total);

    return (
        <div className="bg-gray-50 min-h-screen w-full">
            <Header />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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

                        <Results results={users} />

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
            </main>
        </div>
    );
}