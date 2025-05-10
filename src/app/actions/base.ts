import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "../logto";
import { Model, Document, FilterQuery, PopulateOptions } from 'mongoose';
import { AppError, handleAsync } from '@/lib/errorHandler';
import logger from "@/lib/logger";


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

    protected handleError(operation: string, error: unknown): Error {
        if (error instanceof Error) {
            return new AppError(`Failed to ${operation} document: ${error.message}`);
        }
        return new AppError(`Failed to ${operation} document: ${String(error)}`);
    }

    protected async validateDocument(document: T): Promise<void> {
        // No-op: Override in child classes for custom validation
        void document; // Prevents unused parameter warning
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
}

export default BaseActions;