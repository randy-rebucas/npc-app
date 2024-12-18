
import CustomPagination from "@/components/pagination";
import Search from "@/components/ui/search";
import { Suspense } from "react";
import { MembersTableSkeleton } from "../../skeletons";
import { getMembersPages } from "@/lib/data/members-data";
import Table from "@/components/ui/member/table";

export default async function Webhook({ query, currentPage, ITEMS_PER_PAGE }: { query: string, currentPage: number, ITEMS_PER_PAGE: number }) {
    const totalPages = await getMembersPages(query, ITEMS_PER_PAGE);
    return (
        <div className="space-y-4">
            <div className='mt-4 flex items-center justify-between gap-2 md:mt-8'>
                <Search placeholder='Search members...' />
            </div>
            <Suspense
                key={query + currentPage}
                fallback={<MembersTableSkeleton />}>
                <Table query={query} currentPage={currentPage} ITEMS_PER_PAGE={ITEMS_PER_PAGE} />
            </Suspense>
            <div className='mt-5 flex w-full justify-center'>
                <CustomPagination totalPages={totalPages} currentPage={currentPage} />
            </div>
        </div>
    )
}