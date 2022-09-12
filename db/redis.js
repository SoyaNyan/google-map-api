// packages
import redis from 'redis'
import dotenv from 'dotenv'

// logger
import logger from '../winston.js'

// get config
dotenv.config({ path: './config/.env' })
const { REDIS_ENDPOINT, REDIS_PORT, REDIS_PASSWD } = process.env

// init redis client
const client = redis.createClient({
	socket: {
		host: REDIS_ENDPOINT,
		port: REDIS_PORT,
	},
	password: REDIS_PASSWD,
})

// on error
client.on('error', (err) => {
	logger.error(`[Redis] ${err}`)
})

// on ready
client.on('ready', () => {
	logger.info(`[Redis] Redis cache server is running!`)
})

// connect database
await client.connect()

export { client }
