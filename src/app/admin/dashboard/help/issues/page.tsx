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
import { TrashIcon, PencilIcon } from "lucide-react";
import Link from "next/link";
import { deleteIssue } from "@/app/actions/issue";

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

    const handleDelete = async (data: FormData) => {
        "use server";
        const itemId = data.get("itemId");
        await deleteIssue(itemId as string);
    };

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
                {issues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-md border p-8">
                        <p className="text-lg text-muted-foreground">No issues found</p>
                        <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Reported By</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Reported</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
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
                                        <TableCell className="flex items-center justify-end gap-2 p-3">
                                            <Link href={`/admin/dashboard/help/issues/form/${issue.id}`} className="flex justify-center items-center">
                                                <PencilIcon className="w-4 h-4" />
                                            </Link>
                                            <form action={handleDelete} className="flex justify-center items-center">
                                                <input type="hidden" name="itemId" value={issue.id} />
                                                <button type="submit" className="flex justify-center items-center">
                                                    <TrashIcon className="w-4 h-4 text-red-500" />
                                                </button>
                                            </form>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {issues.length > 0 && (<Pagination
                    startItem={startItem}
                    endItem={endItem}
                    totalItems={total}
                    currentPage={currentPage}
                    query={query}
                    totalPages={totalPages}
                />
                )}
            </div>
        </div>
    );
}