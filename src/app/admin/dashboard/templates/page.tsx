import { SidebarInset } from "@/components/ui/sidebar";
import AdminHeader from "@/components/admin/Header";

import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Metadata } from "next";
import { SearchParams } from "@/lib/types/search-params";
import Pagination from "@/components/ui/member/pagination";
import Search from "@/components/ui/member/search";
import { deleteTemplate, getTemplates } from "@/app/actions/template";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: 'Admin Templates',
};

export default async function TemplatesPage(props: {
    searchParams: SearchParams
}) {
    const ITEMS_PER_PAGE = 10;

    const searchParams = await props.searchParams
    const currentPage = Number(searchParams?.page) || 1;
    const query = String(searchParams?.query || '');

    const { templates, total } = await getTemplates({ page: currentPage, search: query, limit: ITEMS_PER_PAGE });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);

    const handleDelete = async (data: FormData) => {
        "use server";
        const itemId = data.get("itemId");
        await deleteTemplate(itemId as string); 
    };

    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'Templates', href: '/admin/dashboard/templates', active: true },
            ]} />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-foreground">Templates</h1>
                        <Button asChild>
                            <Link href="/admin/dashboard/templates/new" className="flex items-center gap-2">
                                <PlusIcon className="w-4 h-4" />
                                Add Template
                            </Link>
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <Search placeholder='Search templates...' />
                    </div>

                    <div className="rounded-md border border-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Template</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Default</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {templates.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-52 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <div className="space-y-2">
                                                    <h3 className="text-lg font-semibold">No templates yet</h3>
                                                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                                        Create your first template to start managing your content more efficiently.
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    templates.map((template) => {
                                        return (
                                            <TableRow key={template._id}>
                                                <TableCell className="text-sm font-medium text-foreground truncate">{template.name}</TableCell>
                                                <TableCell>{template.type}</TableCell>
                                                <TableCell>{template.isDefault ? "Yes" : "No"}</TableCell>
                                                <TableCell className="flex items-center justify-end gap-2 p-3">
                                                    <Link href={`/admin/dashboard/templates/${template._id}`}>
                                                        <PencilIcon className="w-4 h-4 text-foreground hover:text-primary" />
                                                    </Link>
                                                    <form action={handleDelete} className="flex justify-center items-center">
                                                        <input type="hidden" name="itemId" value={template._id} />
                                                        <button type="submit" className="flex justify-center items-center">
                                                            <TrashIcon className="w-4 h-4 text-destructive hover:text-destructive/80" /> 
                                                        </button>
                                                    </form>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
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
    )
}
