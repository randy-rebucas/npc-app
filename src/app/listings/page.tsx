'use client';

import { useEffect, useState } from 'react';
import { ListingCard } from '@/modules/listings/components/ListingCard';
import { ListingFilters } from '@/modules/listings/components/ListingFilters';
import { ListingActions } from '@/modules/listings/actions';
import { Listing, ListingFilters as FilterType } from '@/modules/listings/types';
import { PaginatedResponse } from '@/modules/core/types';

export default function ListingsPage() {
  const [listings, setListings] = useState<PaginatedResponse<Listing>>();
  const [filters, setFilters] = useState<FilterType>({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const fetchListings = async () => {
      const result = await ListingActions.getListings(filters);
      setListings(result);
    };
    fetchListings();
  }, [filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-6">
        <aside className="w-1/4">
          <ListingFilters 
            filters={filters} 
            onFilterChange={setFilters} 
          />
        </aside>
        <main className="w-3/4">
          <div className="grid grid-cols-2 gap-4">
            {listings?.data.map(listing => (
              <ListingCard 
                key={listing.id} 
                listing={listing}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
} 