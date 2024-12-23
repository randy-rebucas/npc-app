import AdminHeader from "@/components/admin/Header";
import NodeApi from "@/components/ui/member/source/node-api";

import { SidebarInset } from "@/components/ui/sidebar";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>


export default async function Page(props: {
    searchParams: SearchParams
}) {
    const ITEMS_PER_PAGE = 10;
    const params = await props.searchParams;
    const currentPage = Number(params?.page) || 1;

    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                {
                    label: 'Members',
                    href: '/admin/members',
                },
                {
                    label: 'Node API',
                    href: '/admin/members/node-api',
                    active: true,
                },
            ]} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Node API Members</h1>
                    </div>
                    <NodeApi currentPage={currentPage} ITEMS_PER_PAGE={ITEMS_PER_PAGE} />
                </div>
            </div>
        </SidebarInset>
    )
}