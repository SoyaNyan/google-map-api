// packages
import express from 'express'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'
import path from 'path'

// swagger
import swaggerUi from 'swagger-ui-express'
// import swaggerOutput from './swagger/swagger-output.json' assert { type: 'json' }
const swaggerOutput = JSON.parse(readFileSync('./swagger/swagger-output.json'))

// logger
import logger from './winston.js'

// routes
import apiRouter from './routes/apiRouter.js'

// get config
dotenv.config({ path: './config/.env' })
const { SERVER_PORT } = process.env

// init express
const app = express()

// express setting
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/**
 * swagger theme stylesheets
 * node_modules/swagger-ui-express/index.js
 */
app.use(
	'/swagger-themes',
	express.static(path.resolve('./node_modules/swagger-ui-themes/themes/3.x'))
)

// swagger router
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput))

// api router
app.use('/api', apiRouter)

// any other end-points
app.use(/^\/(.*)/, function (req, res) {
	res.status(404).send('404 Not found.')
})

app.use(function (err, req, res, next) {
	res.status(500).send('500 Internal server error.')
})

// start server
app.listen(SERVER_PORT, () => {
	logger.info(`[Express] Server is running on port:${SERVER_PORT}!`)
})
