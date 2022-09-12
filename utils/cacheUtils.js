// redis database
import { client } from '../db/redis.js'
import dotenv from 'dotenv'

// get config
dotenv.config({ path: './config/.env' })
const { CACHE_EXPIRE } = process.env

// get cache
const getCache = async (key) => {
	// get cached data
	const cachedData = await client.get(key)

	// return result
	return cachedData
}

// set cache
const setCache = async (key, data) => {
	// set cache data
	await client.SETEX(key, parseInt(CACHE_EXPIRE), JSON.stringify(data))
}

export { getCache, setCache }
