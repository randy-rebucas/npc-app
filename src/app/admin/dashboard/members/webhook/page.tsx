import { Metadata } from "next";
import Pagination from "@/components/ui/member/pagination";
import { Suspense } from "react";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/ui/table";
import Sync from "@/components/ui/member/sync";
import { MembersTableSkeleton } from "@/components/ui/skeletons";
import Search from "@/components/ui/member/search";
import Filter from "@/components/ui/member/filter";
import { getMembers } from "@/app/actions/members";
import { SearchParams } from "@/lib/types/search-params";

export const metadata: Metadata = {
    title: 'Admin Webhook',
};

interface MemberResponse {
    id: string;
    event: string;
    email: string;
    accountSynced: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export default async function Page({ searchParams }: {
    searchParams: SearchParams
}) {

    const ITEMS_PER_PAGE = 10;
    const params = await searchParams;
    // search params
    const query = String(params?.query || '');
    // page
    const currentPage = Number(params?.page || 1);
    // filters
    const accountSynced = String(params?.accountSynced || 'all');

    // get members
    const { members, total } = await getMembers({ page: currentPage, search: query, accountSynced: accountSynced, limit: ITEMS_PER_PAGE });
    
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(startItem + ITEMS_PER_PAGE - 1, total);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="mx-auto w-full space-y-4">
                {/* <Webhook query={query as string} currentPage={currentPage} ITEMS_PER_PAGE={ITEMS_PER_PAGE} />;   */}
                <div className="flex items-center gap-4">
                    <Search placeholder='Search webhooks...' />
                    <Filter target="accountSynced" options={[{ 'true': 'Synced' }, { 'false': 'Not Synced' }]} placeholder="Synced" defaultValue="all" />
                </div>

                <Suspense
                    key={query + currentPage}
                    fallback={<MembersTableSkeleton />}>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Event</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Account Synced</TableHead>
                                    <TableHead className="text-right">Created At</TableHead>
                                    <TableHead className="text-right">Updated At</TableHead>
                                    <TableHead className="text-right">Sync</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members?.map((member: MemberResponse) => (
                                    <TableRow key={member.id}>
                                        <TableCell className="font-medium">{member.event}</TableCell>
                                        <TableCell>{member.email}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.accountSynced
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}>
                                                {member.accountSynced ? 'Synced' : 'Not Synced'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">{member.createdAt.toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">{member.updatedAt.toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Sync id={member.id} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
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