import React from 'react';
import { ListingFilters as FilterType } from '../types';

interface ListingFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
}

export const ListingFilters: React.FC<ListingFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="space-y-4 p-4 border rounded">
      <div>
        <label className="block text-sm font-medium">Sort By</label>
        <select 
          value={filters.sort}
          onChange={(e) => onFilterChange({ ...filters, sort: e.target.value as FilterType['sort'] })}
          className="mt-1 block w-full rounded-md border-gray-300"
        >
          <option value="most_recent">Most Recent</option>
          <option value="lowest_price">Lowest Price</option>
          <option value="highest_price">Highest Price</option>
        </select>
      </div>
      {/* Add more filter options */}
    </div>
  );
}; 