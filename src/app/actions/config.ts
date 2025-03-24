import Config from "../models/Config"
import connect from "@/lib/db"
import { handleAsync } from '@/lib/errorHandler';
import { DatabaseError, ValidationError } from '@/lib/errors';

/**
 * Retrieves the entire configuration object from the database
 * @returns The configuration object or null if not found
 */
export async function getConfig() {
    const [result, error] = await handleAsync(
        (async () => {
            await connect()
            const config = await Config.findOne({})
            return config || null
        })()
    )

    if (error) {
        throw new DatabaseError('Failed to fetch configuration')
    }

    return result
}

/**
 * Retrieves a specific configuration value by key
 * @param key The configuration key to retrieve
 * @returns The configuration value or null if not found
 */
export async function getConfigValue<T>(key: string): Promise<T | null> {
    if (!key) {
        throw new ValidationError('Configuration key is required')
    }

    const [result, error] = await handleAsync(
        (async () => {
            await connect()
            const config = await Config.findOne({})
            return config ? (config[key] as T) : null
        })()
    )

    if (error) {
        throw new DatabaseError(`Failed to fetch configuration value for ${key}`)
    }

    return result
}