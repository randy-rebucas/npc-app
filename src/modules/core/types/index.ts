// Core types used across modules
export interface PaginationParams {
  page: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
} 