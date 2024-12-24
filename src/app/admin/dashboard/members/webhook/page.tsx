import { Metadata } from "next";
import Webhook from "@/components/ui/member/source/webhook";

export const metadata: Metadata = {
    title: 'Admin Webhook',
};

export default async function Page({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    
    const ITEMS_PER_PAGE = 10;
    const query = String(searchParams?.query || '');
    const currentPage = Number(searchParams?.page || 1);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="mx-auto w-full space-y-4">
                <Webhook query={query as string} currentPage={currentPage} ITEMS_PER_PAGE={ITEMS_PER_PAGE} />;  
            </div>
        </div>
    );
}