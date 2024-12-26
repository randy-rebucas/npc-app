import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getUsers } from "@/app/actions/user";
import Link from "next/link";

export default async function AdminUserPage() {
    const { users } = await getUsers({ page: 1, limit: 10 })
    
    // Filter for new users (last 7 days) with "user" role
    const filteredUsers = users.filter((user) => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return user.role === "CUSTOMER" && user.createdAt > sevenDaysAgo;
    });

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">New Users</CardTitle>
                <Link href="/admin/dashboard/users" className="text-sm text-blue-600 hover:underline">View all</Link>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Join Date</TableHead>
                            <TableHead>Name</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                                <TableCell>{user.username}</TableCell>
                            </TableRow>
                        ))}
                        {filteredUsers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">No new users found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}