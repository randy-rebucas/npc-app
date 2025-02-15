import { TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableBody } from "@/components/ui/table";
import { SidebarInset } from "@/components/ui/sidebar";
import { Table } from "@/components/ui/table";
import { SearchParams } from "@/lib/types/search-params";
import Pagination from "@/components/ui/member/pagination";
import Search from "@/components/ui/member/search";
import Filter from "@/components/ui/member/filter";
import AdminHeader from "@/components/admin/Header";
import { deleteListing, getListings } from "@/app/actions/listing";
import { formatCurrency } from "@/lib/utils";
import { PencilIcon, TrashIcon } from "lucide-react";
import Link from "next/link";


export default async function ListingsPage(props: {
    searchParams: SearchParams
}) {

    const ITEMS_PER_PAGE = 10;

    const searchParams = await props.searchParams
    const currentPage = Number(searchParams?.page) || 1;
    const query = String(searchParams?.query || '');
    const status = String(searchParams?.status || 'all');
    const stateLicense = String(searchParams?.stateLicense || '');
    const practiceType = String(searchParams?.practiceType || '');
    const priceRange = String(searchParams?.priceRange || '');

    const { listings, total } = await getListings({ page: currentPage, search: query, limit: ITEMS_PER_PAGE, status: status, sort: "most_recent", stateLicense: stateLicense, practiceType: practiceType, priceRange: priceRange });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);


    const handleDelete = async (data: FormData) => {
        "use server";
        const itemId = data.get("itemId");
        await deleteListing(itemId as string); 
    };
    
    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'Listings', href: '/admin/dashboard/listings', active: true },
            ]} />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Listings</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <Search placeholder='Search listings...' />
                        <Filter target="status" options={[{ 'ACTIVE': 'Active' }, { 'INACTIVE': 'Inactive' }]} placeholder="Status" defaultValue="all" />
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Base Rate</TableHead>
                                    <TableHead>Practice Type</TableHead>
                                    <TableHead>State License</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listings.map((listing) => {
                                    return (
                                        <TableRow key={listing.id}>
                                            <TableCell>{listing.title}</TableCell>
                                            <TableCell>{listing.email}</TableCell>
                                            <TableCell>{listing.status}</TableCell>
                                            <TableCell>{listing.createdAt.toLocaleString()}</TableCell>
                                            <TableCell>{formatCurrency(listing.monthlyBaseRate * 100)}</TableCell>
                                            <TableCell>{listing.practiceTypes.join(', ')}</TableCell>
                                            <TableCell>{listing.stateLicenses.join(', ')}</TableCell>
                                            <TableCell className="flex items-center justify-end gap-2 p-3">
                                                <Link href={`/admin/dashboard/listings/${listing.id}`}> 
                                                    <PencilIcon className="w-4 h-4 text-foreground hover:text-primary" />
                                                </Link>
                                                <form action={handleDelete} className="flex justify-center items-center">
                                                    <input type="hidden" name="itemId" value={listing.id} />
                                                    <button type="submit" className="flex justify-center items-center">
                                                        <TrashIcon className="w-4 h-4 text-destructive hover:text-destructive/80" /> 
                                                    </button>
                                                </form>
                                            </TableCell>
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

