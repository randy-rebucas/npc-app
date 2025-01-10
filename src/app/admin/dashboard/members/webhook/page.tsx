import { Metadata } from "next";
import Pagination from "@/components/ui/member/pagination";
import { Suspense } from "react";

import { MembersTableSkeleton } from "@/components/ui/skeletons";
import Search from "@/components/ui/member/search";
import Filter from "@/components/ui/member/filter";
import { getMembers } from "@/app/actions/members";
import { SearchParams } from "@/lib/types/search-params";
import { Table, TableBody, TableRow, TableCell, TableHead, TableHeader } from "@/components/ui/table";
import Link from "next/link";
import { EyeIcon } from "lucide-react";

export const metadata: Metadata = {
    title: 'Admin Members Webhook',
};

export interface MemberResponse {
    id: string;
    event: string;
    email: string;
    memberstackId: string;
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
    const { members, total } = await getMembers({
        page: currentPage,
        search: query,
        accountSynced: accountSynced,
        limit: ITEMS_PER_PAGE
    }) as { members: MemberResponse[], total: number };

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(startItem + ITEMS_PER_PAGE - 1, total);

    return (
        <>
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
                                <TableHead className="text-center">Created At</TableHead>
                                <TableHead className="text-center">Updated At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
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
                                    <TableCell className="text-center">{member.createdAt.toLocaleDateString()}</TableCell>
                                    <TableCell className="text-center">{member.updatedAt.toLocaleDateString()}</TableCell>
                                    <TableCell className="flex items-center justify-end gap-2 p-3">
                                        <Link href={`/admin/dashboard/members/webhook/${member.memberstackId}`} className="flex justify-center items-center">
                                            <EyeIcon className="w-4 h-4" />
                                        </Link>
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
        </>

    );
}