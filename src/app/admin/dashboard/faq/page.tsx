import { SidebarInset } from "@/components/ui/sidebar";
import AdminHeader from "@/components/admin/Header";

import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Metadata } from "next";
import { SearchParams } from "@/lib/types/search-params";
import Pagination from "@/components/ui/member/pagination";
import Search from "@/components/ui/member/search";
import { getFaqs } from "@/app/actions/faq";

export const metadata: Metadata = {
    title: 'Admin FAQ',
};

export default async function FAQPage(props: {
    searchParams: SearchParams
}) {
    const ITEMS_PER_PAGE = 10;

    const searchParams = await props.searchParams
    const currentPage = Number(searchParams?.page) || 1;
    const query = String(searchParams?.query || '');

    const { faqs, total } = await getFaqs({ page: currentPage, search: query, limit: ITEMS_PER_PAGE });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);

    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'FAQ', href: '/admin/dashboard/faq', active: true },
            ]} />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">FAQ</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <Search placeholder='Search faqs...' />
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Question</TableHead>
                                    {/* <TableHead>Answer</TableHead> */}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {faqs.map((faq) => {
                                    return (
                                        <TableRow key={faq._id}>
                                            <TableCell className="text-sm font-medium text-gray-900 truncate">{faq.question}</TableCell>
                                            {/* <TableCell>{faq.answer}</TableCell> */}
                                        </TableRow>
                                    );
                                })}
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