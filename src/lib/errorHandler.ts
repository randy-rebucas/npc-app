import logger from './logger'

/**
 * Custom application error class that includes status code and error code
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON() {
    return {
      error: {
        message: this.message,
        code: this.code,
        statusCode: this.statusCode,
        details: this.details
      }
    }
  }
}

/**
 * Generic async error handler that provides type safety and consistent error handling
 * @param promise - Promise to be handled
 * @returns Tuple of [data, error] where one will always be null
 */
export const handleAsync = async <T>(
  promise: Promise<T>
): Promise<[T | null, AppError | null]> => {
  try {
    const data = await promise
    return [data, null]
  } catch (error) {
    logger.error({
      err: error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })
    if (error instanceof AppError) {
      return [null, error]
    }
    return [null, new AppError(
      String(error),
      500,
      'UNKNOWN_ERROR',
      { originalError: error }
    )]
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new AppError(error.message, 500);
  }
  
  return new AppError('An unknown error occurred', 500);
} 