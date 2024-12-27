import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Metadata } from "next";
import { SearchParams } from "@/lib/types/search-params";
import Pagination from "@/components/ui/member/pagination";
import Search from "@/components/ui/member/search";
import { getFeatures } from "@/app/actions/feature";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Filter from "@/components/ui/member/filter";

export const metadata: Metadata = {
    title: 'Admin Requested Features',
};

export default async function FeaturesPage(props: {
    searchParams: SearchParams
}) {
    const ITEMS_PER_PAGE = 10;

    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;
    const query = String(searchParams?.query || '');
    const status = String(searchParams?.status || 'all');

    const { features, total } = await getFeatures({ page: currentPage, search: query, status: status, limit: ITEMS_PER_PAGE });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);

    return (

        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="mx-auto w-full space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Requested Features</h1>
                </div>

                <div className="flex items-center gap-4">
                    <Search placeholder='Search features...' />
                    <Filter target="status" options={[{ 'pending': 'Pending' }, { 'resolved': 'Resolved' }, { 'closed': 'Closed' }]} placeholder="Filter by status" defaultValue="all" />
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Feature</TableHead>
                                <TableHead>Requested By</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Requested Date</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {features.map((feature) => (
                                <TableRow key={feature.id}>
                                    <TableCell>{feature.title}</TableCell>
                                    <TableCell>{feature.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            feature.status === 'pending' ? 'destructive' :
                                                feature.status === 'resolved' ? 'default' :
                                                    feature.status === 'closed' ? 'secondary' :
                                                        'outline'
                                        }>
                                            {feature.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDistanceToNow(new Date(feature.createdAt), { addSuffix: true })}</TableCell>
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