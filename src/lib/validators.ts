import { z } from 'zod'

/**
 * Common validation schemas for API requests
 */

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1)
    .describe('Page number for pagination'),
  limit: z.number().int().positive().max(100).default(10)
    .describe('Number of items per page'),
  sort: z.record(z.enum(['asc', 'desc']))
    .optional()
    .describe('Sorting criteria'),
})

export const SearchSchema = z.object({
  query: z.string().trim().min(1).max(100)
    .describe('Search query string'),
})

export const IdSchema = z.object({
  id: z.string().trim().min(1)
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId')
    .describe('MongoDB ObjectId'),
})

export type PaginationParams = z.infer<typeof PaginationSchema>
export type SearchParams = z.infer<typeof SearchSchema>
export type IdParam = z.infer<typeof IdSchema> 