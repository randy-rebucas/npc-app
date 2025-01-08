import Pagination from "@/components/ui/member/pagination";
import Search from "@/components/ui/member/search";
import Filter from "@/components/ui/member/filter";
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { SearchParams } from '@/lib/types/search-params';
import { getPracticeTypesPaginated } from '@/app/actions/practicetypes';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


export default async function PracticeTypesPage(props: {
    searchParams: SearchParams
}) {
    const ITEMS_PER_PAGE = 10;

    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;
    const query = String(searchParams?.query || '');
    const enabled = String(searchParams?.enabled || 'all');

    const { practiceTypes, total } = await getPracticeTypesPaginated({ page: currentPage, search: query, enabled: enabled, limit: ITEMS_PER_PAGE });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="mx-auto w-full space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Practice Types</h1>
                    <Button>Add Practice Type</Button>
                </div>

                <div className="flex items-center gap-4">
                    <Search placeholder='Search practice types...' />
                    <Filter target="enabled" options={[{ 'true': 'Enabled' }, { 'false': 'Disabled' }]} placeholder="Filter" defaultValue="all" />
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Practice Type</TableHead>
                                <TableHead>Enabled</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {practiceTypes.map((practiceType) => (
                                <TableRow key={practiceType._id}>
                                    <TableCell>{practiceType.type}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            practiceType.enabled ? 'default' :
                                                'secondary'
                                        }>
                                            {practiceType.enabled ? 'Enabled' : 'Disabled'}
                                        </Badge>
                                    </TableCell>
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
