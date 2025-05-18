import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "../logto";
import { Model, Document, FilterQuery, PopulateOptions } from 'mongoose';
import { AppError, handleAsync } from '@/lib/errorHandler';
import logger from "@/lib/logger";
import mongoose from 'mongoose';
import { ValidationError, DatabaseError } from '@/lib/errorHandler';


export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
}

export interface QueryOptions extends PaginationParams {
    select?: string | Record<string, 1 | 0>;
    populate?: string | string[] | object[];
}

/**
 * Base class for all database actions
 * Provides common CRUD operations with proper error handling and logging
 */
abstract class BaseActions<T extends Document> {
    protected abstract model: Model<T>;
    protected abstract resourceName: string;

    /**
     * Gets the authenticated user context
     * @throws {AppError} If user context cannot be retrieved
     */
    protected static async getUser() {
        const [user, error] = await handleAsync(getLogtoContext(logtoConfig));
        if (error) {
            throw new AppError('Authentication failed', 401, 'AUTH_FAILED');
        }
        if (!user) {
            throw new AppError('User not found', 401, 'USER_NOT_FOUND');
        }
        return user;
    }

    /**
     * Finds a single document matching the query
     * @param query - Mongoose filter query
     * @param options - Query options including select and populate
     */
    protected async findOne(
        query: FilterQuery<T>,
        options: QueryOptions = {}
    ): Promise<T | null> {
        const [result, error] = await handleAsync(
            this.model.findOne(query)
                .select(options.select || '')
                .populate(options.populate as PopulateOptions[])
                .exec()
        );

        if (error) {
            logger.error({ error, query }, `Failed to find ${this.resourceName}`);
            throw new AppError(
                `Failed to find ${this.resourceName}`,
                500,
                'FIND_ONE_FAILED',
                { query }
            );
        }

        return result;
    }

    /**
     * Finds multiple documents with pagination
     * @param query - Mongoose filter query
     * @param options - Query options including pagination, select, and populate
     */
    protected async find(
        query: FilterQuery<T>,
        options: QueryOptions = {}
    ): Promise<{ data: T[]; total: number; page: number; totalPages: number }> {
        const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
        const skip = (page - 1) * limit;

        const [results, error] = await handleAsync(
            Promise.all([
                this.model
                    .find(query)
                    .select(options.select || '')
                    .populate(options.populate as PopulateOptions[])
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                this.model.countDocuments(query)
            ])
        );

        if (error) {
            logger.error({ error, query }, `Failed to find ${this.resourceName}s`);
            throw new AppError(
                `Failed to find ${this.resourceName}s`,
                500,
                'FIND_FAILED',
                { query }
            );
        }

        const [data, total] = results!;
        const totalPages = Math.ceil(total / limit);

        return { data, total, page, totalPages };
    }

    protected async create(data: Partial<T>): Promise<T> {
        try {
            const newDocument = new this.model(data);
            await this.validateDocument(newDocument);
            return await newDocument.save();
        } catch (error) {
            throw this.handleError('create', error);
        }
    }

    protected async handleError(operation: string, error: unknown): Promise<never> {
        logger.error({ error, operation, resource: this.resourceName }, `${operation} operation failed`);
        
        if (error instanceof mongoose.Error.ValidationError) {
            throw new ValidationError(`Invalid ${this.resourceName} data: ${error.message}`);
        }
        
        if (error instanceof mongoose.Error.CastError) {
            throw new ValidationError(`Invalid ${this.resourceName} ID`);
        }

        if (error instanceof AppError) {
            throw error;
        }

        throw new DatabaseError(
            `Failed to ${operation} ${this.resourceName}: ${error instanceof Error ? error.message : String(error)}`
        );
    }

    protected async validateDocument(document: T): Promise<void> {
        try {
            await document.validate();
        } catch (error) {
            throw this.handleError('validate', error);
        }
    }

    protected async read(id: string): Promise<T | null> {
        try {
            const document = await this.model.findById(id);
            if (!document) {
                throw new Error('Document not found');
            }
            return document;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch document: ${error.message}`);
            } else {
                throw new Error(`Failed to fetch document: ${error}`);
            }
        }
    }

    protected async update(id: string, data: Partial<T>): Promise<T | null> {
        try {
            const document = await this.model.findByIdAndUpdate(
                id,
                { $set: data },
                { new: true, runValidators: true }
            );
            if (!document) {
                throw new Error('Document not found');
            }
            return document;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to update document: ${error.message}`);
            } else {
                throw new Error(`Failed to update document: ${error}`);
            }
        }
    }

    protected async delete(id: string): Promise<void> {
        try {
            const document = await this.model.findByIdAndDelete(id);
            if (!document) {
                throw new Error('Document not found');
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to delete document: ${error.message}`);
            } else {
                throw new Error(`Failed to delete document: ${error}`);
            }
        }
    }

    protected async list(): Promise<T[]> {
        try {
            return await this.model.find();
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch documents: ${error.message}`);
            } else {
                throw new Error(`Failed to fetch documents: ${error}`);
            }
        }
    }

    // Add rate limiting and caching support
    protected async withCache<R>(
        key: string,
        operation: () => Promise<R>,
        options: { ttl?: number; staleWhileRevalidate?: boolean } = { ttl: 3600 }
    ): Promise<R> {
        // TODO: Implement proper caching with Redis/Memcached
        const cached = await this.getCacheValue(key);
        if (cached && (!options.staleWhileRevalidate || Date.now() < cached.expiry)) {
            return cached.value as R;
        }
        const result = await operation();
        await this.setCacheValue(key, result, options.ttl);
        return result;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async getCacheValue(_key: string): Promise<{ value: unknown; expiry: number } | null> {
        // TODO: Implement with actual cache store
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async setCacheValue(_key: string, _value: unknown, _ttl = 3600): Promise<void> {
        // TODO: Implement with actual cache store
    }
}

export default BaseActions;