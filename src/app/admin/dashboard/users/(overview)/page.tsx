import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import Search from "@/components/ui/member/search";
import Filter from "@/components/ui/member/filter";
import Pagination from "@/components/ui/member/pagination";
import { MembersTableSkeleton } from "@/components/ui/skeletons";
import { Metadata } from "next";
import { getUsers } from "@/app/actions/user";
import { Suspense } from "react";
import { SearchParams } from "@/lib/types/search-params";
import { IUserProfile } from "@/app/models/UserProfile";
import { IStripeAccount } from "@/app/models/StripeAccount";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { EyeIcon } from "lucide-react";

// Define a new type for the response from getUsers
type SimplifiedUserResponse = {
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
    // filters
    const role = String(params?.role || 'all');

    // get users
    const { users, total }: { users: SimplifiedUserResponse[], total: number } = await getUsers({
        page: currentPage,
        search: query,
        role: role,
        limit: ITEMS_PER_PAGE
    });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(startItem + ITEMS_PER_PAGE - 1, total);

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Users</h1>
                {/* <Button>Add User</Button> */}
            </div>

            <div className="flex items-center gap-4">
                <Search placeholder='Search users...' />
                <Filter target="role" options={[{ 'ADMIN': 'Admin' }, { 'CUSTOMER': 'Customer' }]} placeholder="Role" defaultValue="all" />
                {/* <Filter target="onboardingStatus" options={[{ 'incomplete': 'Incomplete' }, { 'completed': 'Completed' }]} placeholder="Status" defaultValue="all" /> */}
            </div>

            <div className="rounded-md border">
                <Suspense
                    key={query + currentPage}
                    fallback={<MembersTableSkeleton />}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Provider</TableHead>
                                <TableHead>Stripe Account</TableHead>
                                <TableHead>Onboarding</TableHead>
                                <TableHead>Submission Status</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} className="group">
                                    <TableCell>
                                        {user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'N/A'}
                                    </TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.provider}</TableCell>
                                    <TableCell>
                                        {user.metaData?.stripeAccountId ? user.metaData?.stripeAccountId : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {user.onBoardingStatus === 'COMPLETED' && (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                                                {user.onBoardingStatus}
                                            </span>
                                        )}
                                        {user.onBoardingStatus === 'INCOMPLETE' && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {user.onBoardingStatus}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {user.submissionStatus}
                                    </TableCell>
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