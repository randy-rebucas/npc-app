import Search from "@/components/ui/member/search";
import { Suspense } from "react";
import { MembersTableSkeleton } from "../../skeletons";
import { getMembersCount, getMembersPages } from "@/lib/data/members-data";
import Table from "@/components/ui/member/table";
import { Select, SelectValue, SelectContent, SelectItem, SelectTrigger } from "@radix-ui/react-select";
import CustomPagination from "../custom-pagination";

export default async function Webhook({ query, currentPage, ITEMS_PER_PAGE }: { query: string, currentPage: number, ITEMS_PER_PAGE: number }) {
    const totalPages = await getMembersPages(query, ITEMS_PER_PAGE);
    const totalItems = await getMembersCount(query);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

    return (
        <>
            <div className="flex items-center gap-4">
                <Search placeholder='Search webhooks...' />
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <Suspense
                key={query + currentPage}
                fallback={<MembersTableSkeleton />}>
                <div className="rounded-md border">
                    <Table query={query} currentPage={currentPage} ITEMS_PER_PAGE={ITEMS_PER_PAGE} />
                </div>
            </Suspense>

            <CustomPagination
                startItem={startItem}
                endItem={endItem}
                totalItems={totalItems}
                currentPage={currentPage}
                query={query}
                totalPages={totalPages}
            />
        </>
    )
}