import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "../logto";
import { Model, Document } from 'mongoose';

abstract class BaseActions<T extends Document> {
    protected abstract model: Model<T>;

    protected static async getUser() {
        const user = await getLogtoContext(logtoConfig);
        return user;
    }

    protected async create(data: Partial<T>): Promise<T> {
        try {
            const newDocument = new this.model(data);
            return await newDocument.save();
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to create document: ${error.message}`);
            } else {
                throw new Error(`Failed to create document: ${error}`);
            }
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
}

export default BaseActions;