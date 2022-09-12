// pakcages
import winston from 'winston'
import winstonDaily from 'winston-daily-rotate-file'

// logger setting
const logDir = 'logs'
const { combine, timestamp, printf } = winston.format
const logFormat = printf((info) => `[${info.timestamp}][${info.level}]${info.message}`)

// create loggeer
const logger = winston.createLogger({
	format: combine(
		timestamp({
			format: 'YYYY-MM-DD HH:mm:ss',
		}),
		logFormat
	),
	transports: [
		// info logs
		new winstonDaily({
			level: 'info',
			datePattern: 'YYYY-MM-DD',
			dirname: logDir,
			filename: `%DATE%.log`,
			maxFiles: 30,
			zippedArchive: true,
		}),
		// error logs
		new winstonDaily({
			level: 'error',
			datePattern: 'YYYY-MM-DD',
			dirname: logDir + '/error',
			filename: `%DATE%.error.log`,
			maxFiles: 30,
			zippedArchive: true,
		}),
	],
})

// by env settings
if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new winston.transports.Console({
			format: winston.format.combine(winston.format.colorize()),
		})
	)
} else {
	logger.add(
		new winston.transports.Console({
			format: winston.format.combine(winston.format.colorize()),
		})
	)
}

export default logger
