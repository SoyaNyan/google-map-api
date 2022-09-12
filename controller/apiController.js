// logger
import logger from '../winston.js'

// utilities
import { getPlaceId, getPlaceInfo, getPlaceData } from '../utils/placeUtils.js'
import { setCache } from '../utils/cacheUtils.js'

// placeid api controller
const placeIdController = async (req, res) => {
	// get queries
	const { url } = req.query

	// decode url
	const decodedUrl = decodeURI(url)

	// get name
	const urlPrefix = 'https://www.google.com/maps/place/'
	const placeName = decodedUrl.replace(urlPrefix, '').split('/')[0].replaceAll('+', ' ')

	// log url
	const logUrl = `${urlPrefix}${decodedUrl.replace(urlPrefix, '').split('/')[0]}/`

	// logger
	logger.info(`[API Request] placeid request > url::${logUrl}`)

	// get placeid
	const placeId = await getPlaceId(placeName)

	// check result
	if (!placeId) {
		// logger
		logger.error(`[API Request] Failed to fetch placeid.`)

		// return error
		res.status(200).json({
			success: false,
			message: `Failed to fetch placeid.`,
		})
		return
	}

	// set cache
	await setCache(`placeid::${logUrl}`, placeId)

	// logger
	logger.info(`[Redis] placeid cache created > url::${logUrl}`)

	// return result
	res.status(200).json({
		success: true,
		result: {
			placeId,
		},
	})
}

// placeinfo api controller
const placeInfoController = async (req, res) => {
	// get queries
	const { place_id } = req.query

	// logger
	logger.info(`[API Request] placeinfo request > place_id::${place_id}`)

	// request place detail info
	const { success, data, message } = await getPlaceInfo(place_id)

	// on error
	if (!success) {
		// logger
		logger.error(`[PlaceAPI] Google PlaceAPI request failed. (message: ${message})`)

		// return error
		res.status(200).json({
			success: false,
			message: `PlaceAPI request failed. (message: ${message})`,
		})
		return
	}

	// set cache
	await setCache(`placeinfo::${place_id}`, data)

	// logger
	logger.info(`[Redis] placeinfo cache created > place_id::${place_id}`)

	// return result
	res.status(200).json({
		success: true,
		result: {
			placeData: data,
		},
	})
}

// placedata api controller
const placeDataController = async (req, res) => {
	// get queries
	const { url } = req.query

	// decode url
	const decodedUrl = decodeURI(url)

	// log url
	const urlPrefix = 'https://www.google.com/maps/place/'
	const logUrl = `${urlPrefix}${decodedUrl.replace(urlPrefix, '').split('/')[0]}/`

	// logger
	logger.info(`[API Request] placedata request > url::${logUrl}`)

	// get place data
	const data = await getPlaceData(decodedUrl)

	// check result
	if (!data) {
		// logger
		logger.error(`[API Request] Failed to fetch place data.`)

		// return error
		res.status(200).json({
			success: false,
			message: `Failed to fetch place data.`,
		})
		return
	}

	// set cache
	await setCache(`placedata::${logUrl}`, data)

	// logger
	logger.info(`[Redis] placedata cache created > url::${logUrl}`)

	// return result
	res.status(200).json({
		success: true,
		result: {
			placeData: data,
		},
	})
}

export { placeIdController, placeInfoController, placeDataController }
