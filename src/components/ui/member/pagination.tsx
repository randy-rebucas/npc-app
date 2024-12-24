import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

export default function CustomPagination({
    totalPages,
    currentPage,
    itemsPerPage = 10,
    totalItems
}: {
    totalPages: number,
    currentPage: number,
    itemsPerPage?: number,
    totalItems: number
}) {
    const startItem = ((currentPage - 1) * itemsPerPage) + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Generate page numbers to display
    const getPageNumbers = () => {
        const delta = 2; // Number of pages to show before and after current page
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
                Showing {startItem} to {endItem} of {totalItems} entries
            </div>

            <Pagination>
                <PaginationContent className="flex flex-wrap items-center gap-1">
                    <PaginationItem>
                        <PaginationPrevious
                            href={`?page=${currentPage - 1}`}
                            aria-disabled={currentPage <= 1}
                            className={`${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}
                        />
                    </PaginationItem>

                    {getPageNumbers().map((pageNum, idx) => (
                        <PaginationItem key={idx}>
                            {pageNum === '...' ? (
                                <span className="px-4 py-2">...</span>
                            ) : (
                                <a
                                    href={`?page=${pageNum}`}
                                    className={`px-4 py-2 rounded-md hover:bg-muted ${
                                        currentPage === pageNum
                                            ? 'bg-primary text-primary-foreground'
                                            : ''
                                    }`}
                                >
                                    {pageNum}
                                </a>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            href={`?page=${currentPage + 1}`}
                            aria-disabled={currentPage >= totalPages}
                            className={`${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}