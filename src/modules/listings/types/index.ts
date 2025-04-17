import { PaginationParams } from "@/modules/core/types";

export interface Listing {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  // ... other listing properties
}

export interface ListingFilters extends PaginationParams {
  sort?: 'lowest_price' | 'highest_price' | 'most_recent';
  status?: string;
  stateLicense?: string;
  practiceType?: string;
  priceRange?: string;
} 