import { BaseError } from './errors';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: number;
  };
}

export function createResponse<T>(data?: T, error?: Error): ApiResponse<T> {
  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error instanceof BaseError ? error.statusCode : 500,
      },
    };
  }
  return {
    success: true,
    data,
  };
} 