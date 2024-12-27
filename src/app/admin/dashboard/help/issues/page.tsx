import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Metadata } from "next";
import { SearchParams } from "@/lib/types/search-params";
import Pagination from "@/components/ui/member/pagination";
import Search from "@/components/ui/member/search";
import { formatDistanceToNow } from "date-fns";
import { getIssues } from "@/app/actions/issue";
import { IReportedIssue } from "@/app/models/ReportedIssue";
import Filter from "@/components/ui/member/filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: 'Admin Reported Issues',
};

export default async function IssuesPage(props: {
    searchParams: SearchParams
}) {
    const ITEMS_PER_PAGE = 10;

    const searchParams = await props.searchParams
    const currentPage = Number(searchParams?.page) || 1;
    const query = String(searchParams?.query || '');
    const status = String(searchParams?.status || 'all');

    // TODO: Replace with actual getIssues function
    const { issues, total } = await getIssues({ page: currentPage, search: query, status: status, limit: ITEMS_PER_PAGE });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);

    return (

        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="mx-auto w-full space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Reported Issues</h1>
                </div>

                <div className="flex items-center gap-4">
                    <Search placeholder='Search issues...' />
                    <Filter target="status" options={[{ 'pending': 'Pending' }, { 'resolved': 'Resolved' }, { 'closed': 'Closed' }]} placeholder="Filter by status" defaultValue="all" />
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Reported By</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Reported</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {issues.map((issue: IReportedIssue) => (
                                <TableRow key={issue.id}>
                                    <TableCell>{issue.title}</TableCell>
                                    <TableCell>{issue.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            issue.status === 'pending' ? 'destructive' :
                                                issue.status === 'resolved' ? 'default' :
                                                    issue.status === 'closed' ? 'secondary' :
                                                        'outline'
                                        }>
                                            {issue.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</TableCell>
                                    <TableCell>
                                        <Button variant="outline">View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
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
    );
}