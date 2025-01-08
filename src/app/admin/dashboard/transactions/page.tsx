import { SidebarInset } from "@/components/ui/sidebar";
import AdminHeader from "@/components/admin/Header";

import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Metadata } from "next";
import { SearchParams } from "@/lib/types/search-params";
import Pagination from "@/components/ui/member/pagination";
import Search from "@/components/ui/member/search";
import Filter from "@/components/ui/member/filter";
import { getTransactions } from "@/app/actions/transactions";
import { formatDistanceToNow } from "date-fns";
import { Box } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: 'Admin Transactions',
};

export default async function TransactionsPage(props: {
    searchParams: SearchParams
}) {

    const ITEMS_PER_PAGE = 10;

    const searchParams = await props.searchParams
    const currentPage = Number(searchParams?.page) || 1;
    const query = String(searchParams?.query || '');
    const status = String(searchParams?.status || 'all');

    const { transactions, total } = await getTransactions({ page: currentPage, search: query, status: status, limit: ITEMS_PER_PAGE });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);

    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'Transactions', href: '/admin/dashboard/transactions', active: true },
            ]} />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Transactions</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <Search placeholder='Search transactions...' />
                        <Filter target="status" options={[{ 'all': 'All' }, { 'pending': 'Pending' }, { 'completed': 'Completed' }, { 'failed': 'Failed' }]} placeholder="Status" defaultValue="all" />
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Currency</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.length > 0 ? (
                                    transactions.map((transaction) => {
                                        return (
                                            <TableRow key={transaction._id}>
                                                <TableCell>{transaction.user}</TableCell>
                                                <TableCell>{transaction.amount}</TableCell>
                                                <TableCell>{transaction.currency}</TableCell>
                                                <TableCell>{transaction.status}</TableCell>
                                                <TableCell>{formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}</TableCell>
                                                <TableCell>
                                                    <Button variant="outline">View</Button> 
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-4">
                                            <div className="flex flex-col items-center">
                                                <Box className="w-8 h-8 mb-4" />
                                                <p className="text-lg font-medium">No transactions found</p>
                                                <p className="text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
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