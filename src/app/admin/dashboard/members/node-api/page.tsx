import NodeApi from "@/components/ui/member/source/node-api";
import { Metadata } from "next";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>


export const metadata: Metadata = {
    title: 'Admin Node API',
};

export default async function Page(props: {
    searchParams: SearchParams
}) {
    const ITEMS_PER_PAGE = 10;
    const params = await props.searchParams;
    const currentPage = Number(params?.page) || 1;

    return <NodeApi currentPage={currentPage} ITEMS_PER_PAGE={ITEMS_PER_PAGE} />;
}