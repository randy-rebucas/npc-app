import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

export default function CustomPagination({ totalPages, currentPage }: { totalPages: number, currentPage: number }) {
    // Calculate which page numbers to show
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious 
                        href={`?page=${currentPage - 1}`}
                        aria-disabled={currentPage <= 1}
                        className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>

                {pageNumbers.map((pageNum) => (
                    <PaginationItem key={pageNum}>
                        <PaginationLink 
                            href={`?page=${pageNum}`}
                            isActive={pageNum === currentPage}
                        >
                            {pageNum}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext 
                        href={`?page=${currentPage + 1}`}
                        aria-disabled={currentPage >= totalPages}
                        className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}