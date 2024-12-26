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
import { UserActions } from "@/components/ui/user/actions";
import { getUsers } from "@/app/actions/user";
import Filter from "@/components/ui/member/filter";
import Pagination from "@/components/ui/member/pagination";
import { Suspense } from "react";
import { MembersTableSkeleton } from "@/components/ui/skeletons";
import { SearchParams } from "@/lib/types/search-params";

interface UserResponse {
    id: string;
    username: string;
    email: string;
    role: "ADMIN" | "CUSTOMER";
    provider: string;
    onboardingStatus: "incomplete" | "completed";
    createdAt: Date;
}

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
    const { users, total } = await getUsers({ page: currentPage, search: query, role: role, onboardingStatus: onboardingStatus, limit: ITEMS_PER_PAGE });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(startItem + ITEMS_PER_PAGE - 1, total);

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
                                        <TableHead>Username</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Provider</TableHead>
                                        <TableHead>Onboarding</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user: UserResponse) => (
                                        <TableRow key={user.id} className="group">
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                            <TableCell>
                                                {user.provider}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.onboardingStatus === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {user.onboardingStatus}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <UserActions userId={user.id} />
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