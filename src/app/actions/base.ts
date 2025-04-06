import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "../logto";
import { Model, Document } from 'mongoose';
import { DatabaseError } from "@/lib/errors";

abstract class BaseActions<T extends Document> {
    protected abstract model: Model<T>;

    protected static async getUser() {
        const user = await getLogtoContext(logtoConfig);
        return user;
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
            return new DatabaseError(`Failed to ${operation} document: ${error.message}`);
        }
        return new DatabaseError(`Failed to ${operation} document: ${String(error)}`);
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