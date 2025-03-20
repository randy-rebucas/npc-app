import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import Search from "@/components/ui/member/search";
import { MembersTableSkeleton } from "@/components/ui/skeletons";
import { Metadata } from "next";
import { getUsers } from "@/app/actions/user";
import { Suspense } from "react";
import { SearchParams } from "@/lib/types/search-params";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { EyeIcon } from "lucide-react";

export const metadata: Metadata = {
    title: 'Admin Users',
};

export default async function AdminUsers(props: {
    searchParams: SearchParams
}) {
    const ITEMS_PER_PAGE = 10;
    const params = await props.searchParams;
    // search params
    const query = String(params?.query || '');
    // page
    const currentPage = Number(params?.page) || 1;

    // get users
    const users = await getUsers({
        page: currentPage,
        page_size: ITEMS_PER_PAGE,
    });
 
    // const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    // const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    // const endItem = Math.min(startItem + ITEMS_PER_PAGE - 1, users.length);

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Users</h1>
            </div>

            <div className="flex items-center gap-4">
                <Search placeholder='Search users...' />
                {/* <Filter target="role" options={[{ 'ADMIN': 'Admin' }, { 'PHYSICIAN': 'Physician' }, { 'NURSE_PRACTITIONER': 'Nurse Practitioner' }]} placeholder="Role" defaultValue="all" />
                <Filter target="onBoardingStatus" options={[{ 'COMPLETED': 'Completed' }, { 'INCOMPLETE': 'Incomplete' }]} placeholder="Onboarding Status" defaultValue="all" />
                <Filter target="submissionStatus" options={[{ 'PENDING': 'Pending' }, { 'APPROVED': 'Approved' }, { 'REJECTED': 'Rejected' }, { 'INCOMPLETE': 'Incomplete' }, { 'INCORRECT': 'Incorrect' }]} placeholder="Submission Status" defaultValue="all" /> */}
            </div>

            <div className="rounded-md border">
                <Suspense
                    key={query + currentPage}
                    fallback={<MembersTableSkeleton />}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Role</TableHead>
                                {/* <TableHead>Stripe Account</TableHead>
                                <TableHead>Onboarding</TableHead>
                                <TableHead>Submission Status</TableHead>
                                <TableHead>Synced</TableHead> */}
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} className="group">
                                    <TableCell>
                                        {user.name ?? 'N/A'}
                                    </TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.primaryEmail}</TableCell>
                                    <TableCell>{user.primaryPhone}</TableCell>
                                    <TableCell>{user.customData?.role}</TableCell>
                                    {/* <TableCell>
                                        {user.customData?.stripeAccountId ? user.customData?.stripeAccountId : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {user.customData?.onBoardingStatus === 'COMPLETED' && (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                                                {user.customData?.onBoardingStatus}
                                            </span>
                                        )}
                                        {user.customData?.onBoardingStatus === 'INCOMPLETE' && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {user.customData?.onBoardingStatus}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {user.customData?.submissionStatus}
                                    </TableCell>
                                    <TableCell>
                                        {user.customData?.accountSynced ? 'Yes' : 'No'}
                                    </TableCell> */}
                                    <TableCell>
                                        {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                    </TableCell>
                                    <TableCell className="flex items-center justify-end gap-2 p-3">
                                        <Link href={`/admin/dashboard/users/${user.id}`}>
                                            <EyeIcon className="w-4 h-4" />
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Suspense>
            </div>

            {/* <Pagination
                startItem={startItem}
                endItem={endItem}
                totalItems={total}
                currentPage={currentPage}
                query={query}
                totalPages={totalPages}
            /> */}
        </>

    );
}   