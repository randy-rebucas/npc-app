import Config from "../models/Config"
import connect from "@/lib/db"

export async function getConfig() {
    await connect()
    const config = await Config.findOne({})
    return config
}

export async function getConfigValue(key: string) {
    await connect()
    const config = await Config.findOne({})
    return config ? config[key] : null
}