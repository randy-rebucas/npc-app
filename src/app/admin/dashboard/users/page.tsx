import AdminHeader from "@/components/admin/Header";
import { SidebarInset } from "@/components/ui/sidebar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Search from "@/components/ui/member/search";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { getUsers } from "@/app/actions/user";
import Filter from "@/components/ui/member/filter";
import Pagination from "@/components/ui/member/pagination";
import { Suspense } from "react";
import { MembersTableSkeleton } from "@/components/ui/skeletons";
import { SearchParams } from "@/lib/types/search-params";
import { IUserProfile } from "@/app/models/UserProfile";
import { IStripeAccount } from "@/app/models/StripeAccount";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { EyeIcon } from "lucide-react";

// Define a new type for the response from getUsers
type SimplifiedUserResponse = {
    id: string;
    username: string;
    email: string;
    role: string;
    provider: string;
    onboardingStatus: string;
    createdAt: Date;
    validated?: boolean;
    profile?: IUserProfile;
    stripeaccount?: IStripeAccount;
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
    const onboardingStatus = String(params?.onboardingStatus || 'all');

    // get users
    const { users, total }: { users: SimplifiedUserResponse[], total: number } = await getUsers({
        page: currentPage,
        search: query,
        role: role,
        onboardingStatus: onboardingStatus,
        limit: ITEMS_PER_PAGE
    });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(startItem + ITEMS_PER_PAGE - 1, total);

    console.log(users);

    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'Users', href: '/admin/dashboard/users', active: true },
            ]} />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Users</h1>
                        <Button>Add User</Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <Search placeholder='Search users...' />
                        <Filter target="role" options={[{ 'ADMIN': 'Admin' }, { 'CUSTOMER': 'Customer' }]} placeholder="Role" defaultValue="all" />
                        <Filter target="onboardingStatus" options={[{ 'incomplete': 'Incomplete' }, { 'completed': 'Completed' }]} placeholder="Status" defaultValue="all" />
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
                                        <TableHead>Validated</TableHead>
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
                                                {user.stripeaccount ? user.stripeaccount.stripeAccountId : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.onboardingStatus === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {user.onboardingStatus}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.validated ? 'default' : 'destructive'}>
                                                    {user.validated ? 'Validated' : 'Not Validated'}
                                                </Badge>
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
                </div>
            </div>
        </SidebarInset>
    );
}   