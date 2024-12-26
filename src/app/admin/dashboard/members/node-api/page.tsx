import { MemberstackAdminService } from "@/utils/memberstack-admin";
import { Metadata } from "next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Pagination from "@/components/ui/member/pagination";
import Search from "@/components/ui/member/search";
import { Suspense } from "react";
import { MembersTableSkeleton } from "@/components/ui/skeletons";
import { SearchParams } from "@/lib/types/search-params";

interface Member {
    id: string
    profileImage?: string
    createdAt: string
    auth: {
        email: string
    },
    verified: boolean,
    customFields: {
        [key: string]: string
    }
}

export const metadata: Metadata = {
    title: 'Admin Node API',
};

export default async function Page(props: {
    searchParams: SearchParams
}) {

    const ITEMS_PER_PAGE = 10;

    const params = await props.searchParams;

    const currentPage = Number(params?.page) || 1;

    const { data: members, totalCount: count } = await MemberstackAdminService.listMembers(currentPage, ITEMS_PER_PAGE)

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, count);

    return (
        <div className="mx-auto w-full space-y-4">
            <div className="flex items-center gap-4">
                <Search placeholder='Search members...' />
            </div>
            <div className="rounded-md border">
                <Suspense
                    key={currentPage}
                    fallback={<MembersTableSkeleton />}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Avatar</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Verified</TableHead>
                                <TableHead>Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((member: Member) => (
                                <TableRow key={member.id}>
                                    <TableCell className="flex items-center gap-2">
                                        <Avatar>
                                            <AvatarImage src={member.profileImage} />
                                            <AvatarFallback>
                                                {member.auth.email.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>{member.auth.email}</TableCell>
                                    <TableCell>{member.verified ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>{new Date(member.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Suspense>
            </div>
            <Pagination totalPages={totalPages} currentPage={currentPage} totalItems={count} startItem={startItem} endItem={endItem} query={''} />
        </div>
    );
}