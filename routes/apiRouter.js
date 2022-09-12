// packages
import express from 'express'

// middlewares
import {
	checkPlaceIdChace,
	checkPlaceInfoChace,
	checkPlaceDataChace,
} from '../middlewares/apiCacheMiddleware.js'

// controllers
import {
	placeDataController,
	placeIdController,
	placeInfoController,
} from '../controller/apiController.js'

// get express router
const router = express.Router()

// routes
/**
 * get place id from google map url
 */
router.get('/placeid', checkPlaceIdChace, placeIdController)

/**
 * get place detail info by placeid
 */
router.get('/placeinfo', checkPlaceInfoChace, placeInfoController)

/**
 * get place data from google map url
 */
router.get('/placedata', checkPlaceDataChace, placeDataController)

export default router
