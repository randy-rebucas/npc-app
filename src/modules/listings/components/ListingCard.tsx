import React from 'react';
import { Listing } from '../types';
import { formatCurrency } from '@/modules/core/utils/format';

interface ListingCardProps {
  listing: Listing;
  onSelect?: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onSelect }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold">{listing.title}</h3>
      <p className="text-gray-600">{listing.description}</p>
      <p className="text-primary font-bold">{formatCurrency(listing.price)}</p>
      <button 
        onClick={() => onSelect?.(listing)}
        className="mt-2 bg-primary text-white px-4 py-2 rounded"
      >
        View Details
      </button>
    </div>
  );
}; 