import Header from "@/components/header";
import Webhook from "@/components/ui/member/source/webhook";
import { SidebarInset } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Webhook',
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Page(props: {
    searchParams: SearchParams
}) {
    const ITEMS_PER_PAGE = 10;

    const searchParams = await props.searchParams
    const query = searchParams.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    return (
        <SidebarInset>
            <Header breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                {
                    label: 'Members',
                    href: '/dashboard/members',
                },
                {
                    label: 'Webhook',
                    href: '/dashboard/members/webhook',
                    active: true,
                },
            ]} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Webhook Members</h1>
                    </div>
                    <Webhook query={query as string} currentPage={currentPage} ITEMS_PER_PAGE={ITEMS_PER_PAGE} />
                </div>
            </div>
        </SidebarInset>
    )
}