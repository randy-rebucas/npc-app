import rateLimit from 'express-rate-limit'
import { NextResponse } from 'next/server'

/**
 * Rate limiting middleware configuration
 * Protects against brute force attacks and DoS attempts
 */
export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // 100 requests per window default
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (_, __, ___, options) => {
    return NextResponse.json(
      {
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: options.message || 'Too many requests, please try again later',
          details: {
            windowMs: options.windowMs,
            max: options.max
          }
        }
      },
      { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil(options.windowMs / 1000).toString()
        }
      }
    )
  },
  skip: () => {
    // Skip rate limiting for development environment
    return process.env.NODE_ENV === 'development'
  }
}) 