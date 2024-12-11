import { Metadata } from 'next';
import { Suspense } from 'react';
import { MembersTableSkeleton } from '@/components/ui/skeletons';
import { getMembersPages } from '@/lib/data/members-data';
import Search from '@/components/ui/search';
import Table from '@/components/ui/member/table';
import Pagination from '@/components/ui/pagination';

export const metadata: Metadata = {
    title: 'Members',
};

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const params = await searchParams;
    const query = params?.query || '';
    const currentPage = Number(params?.page) || 1;
    const totalPages = await getMembersPages(query);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Members</h1>
            </div>
            <div className='mt-4 flex items-center justify-between gap-2 md:mt-8'>
                <Search placeholder='Search members...' />
            </div>
            <Suspense
                key={query + currentPage}
                fallback={<MembersTableSkeleton />}
            >
                <Table query={query} currentPage={currentPage} />
            </Suspense>
            <div className='mt-5 flex w-full justify-center'>
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}
