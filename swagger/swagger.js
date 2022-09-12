// packages
import swaggerAutogen from 'swagger-autogen'

// swagger setting
const doc = {
	swaggerDefinition: {
		info: {
			title: 'GoogleMap Place Detail API',
			version: '1.0.0',
			description: 'Place detail api for google map dev.',
		},
		host: 'localhost:7767',
		schemes: ['http'],
	},
}

// output setting
const outputFile = './swagger/swagger-output.json'
const endpointsFiles = ['./app.js']

// init swagger
swaggerAutogen()(outputFile, endpointsFiles, doc)
