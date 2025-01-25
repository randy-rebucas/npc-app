import Config from "../models/Config"
import connect from "@/lib/db"

/**
 * Retrieves the entire configuration object from the database
 * @returns The configuration object or null if not found
 */
export async function getConfig() {
    try {
        await connect()
        const config = await Config.findOne({})
        return config || null
    } catch (error) {
        console.error('Error fetching config:', error)
        throw new Error('Failed to fetch configuration')
    }
}

/**
 * Retrieves a specific configuration value by key
 * @param key The configuration key to retrieve
 * @returns The configuration value or null if not found
 */
export async function getConfigValue<T>(key: string): Promise<T | null> {
    try {
        await connect()
        const config = await Config.findOne({})
        return config ? (config[key] as T) : null
    } catch (error) {
        console.error(`Error fetching config value for key "${key}":`, error)
        throw new Error(`Failed to fetch configuration value for ${key}`)
    }
}