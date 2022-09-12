// packages
import puppeteer from 'puppeteer'
import axios from 'axios'
import dotenv from 'dotenv'

// utilities
import { formatOpeningHours } from '../utils/timeUtils.js'

// get config
dotenv.config({ path: './config/.env' })
const { GOOGLE_API_KEY } = process.env

/**
 * get placeid from google map page
 */
const getPlaceId = async (placeName) => {
	// browser context
	const browser = await puppeteer.launch({
		headless: true,
	})

	// page setting
	const page = await browser.newPage()
	await page.setViewport({
		width: 1280,
		height: 720,
	})

	// open google map page
	await page.goto(`https://www.google.com/search?q=${placeName}`, {
		waitUntil: 'networkidle0',
	})

	// load selector
	await page.waitForSelector('#wrkpb')

	// eval page code
	const placeId = await page.evaluate(() => {
		// check elem
		const reviewBtn = document.querySelector('#wrkpb')
		if (!reviewBtn) {
			return false
		}

		// get place id
		return document.querySelector('#wrkpb').dataset.pid
	})

	// close browser
	browser.close()

	// return placeid
	return placeId
}

/**
 * get place detail info (Google Place API)
 */
const getPlaceInfo = async (placeId) => {
	// response data fields
	const responseData = [
		'address_components',
		'business_status',
		'formatted_address',
		'geometry',
		'international_phone_number',
		'name',
		'opening_hours',
		'place_id',
		'rating',
	]

	// axios request config
	const config = {
		method: 'get',
		url: `https://maps.googleapis.com/maps/api/place/details/json?fields=${responseData.join(
			','
		)}&place_id=${placeId}&language=ko&key=${GOOGLE_API_KEY}`,
		headers: {},
	}

	// request place info
	const {
		data: { result, status, error_message },
	} = await axios(config)

	// check result
	if (status !== 'OK') {
		return {
			success: false,
			message: error_message,
		}
	}

	// return data
	return {
		success: true,
		message: '',
		data: result,
	}
}

const getPlaceData = async (url) => {
	// browser context
	const browser = await puppeteer.launch({
		headless: true,
	})

	// page setting
	const page = await browser.newPage()
	await page.setViewport({
		width: 1280,
		height: 720,
	})

	// open google map page
	await page.goto(url, {
		waitUntil: 'networkidle0',
	})

	// load selector
	await page.waitForSelector('#QA0Szd')

	// eval page code
	const placeData = await page.evaluate((url) => {
		// check elem
		const placeInfoPane = document.querySelector('#QA0Szd')
		if (!placeInfoPane) {
			return false
		}

		// geometry
		const urlPrefix = 'https://www.google.com/maps/place/'
		const rawGeometry = url.replace(urlPrefix, '').split('/')[1]
		const [lat, lng, zoom] = rawGeometry.replace(/[@z]/gi, '').split(',')

		// name
		const name = document.querySelector('.lMbq3e h1 span')?.innerText

		// desc
		const desc = document.querySelector('.PYvSYb span')?.innerText

		// address
		const addressGlobal = document.querySelector(
			'button[data-item-id="address"] .Io6YTe'
		)?.innerText
		const address = document.querySelector('button[data-item-id="laddress"] .Io6YTe')?.innerText

		// business status
		const statusCode = {
			'영업 중': 'OPEN',
			'24시간 영업': 'OPEN_24H',
			'금일 휴업': 'CLOSED',
			'입시 휴업': 'CLOSED_TMP',
			'폐업': 'CLOSED_PERM',
		}
		const businessStatusText = document.querySelector(
			'.ZDu9vd > span:nth-child(1) > span'
		)?.innerText
		const businessStatus = businessStatusText ? statusCode[businessStatusText] : undefined

		// opening hours
		const openingHourTable = document.querySelector('.t39EBf.GUrTXd table')
		let openingHours = []
		if (openingHourTable) {
			for (let i = 1; i <= 7; i++) {
				// get opening hour string
				const hourStr = document.querySelector(
					`.t39EBf.GUrTXd table > tbody > tr:nth-child(${i}) li`
				).innerHTML

				// format time
				openingHours.push(hourStr)
			}
		}

		// website
		const website = document.querySelector('a[data-item-id="authority"] .Io6YTe')?.innerText

		// phone
		const phoneFormatted = document.querySelector(
			'button[data-item-id*="phone:"] .Io6YTe'
		)?.innerText
		const phone = document
			.querySelector('button[data-item-id*="phone:"]')
			?.dataset.itemId.replace('phone:tel:', '')
		const phoneData = phone && phoneFormatted ? { short: phone, long: phoneFormatted } : undefined

		// return data
		return {
			geometry: {
				lat,
				lng,
				zoom,
			},
			name,
			desc,
			address: {
				global: addressGlobal,
				long: address,
			},
			businessStatus,
			openingHours,
			website,
			phone: phoneData,
		}
	}, url)

	// close browser
	browser.close()

	// format openingHours data
	const { openingHours } = placeData
	const formattedOpeningHours = []
	for (const openingHour of openingHours) {
		formattedOpeningHours.push(formatOpeningHours(openingHour))
	}

	// return place data
	return {
		...placeData,
		openingHours: formattedOpeningHours,
	}
}

export { getPlaceId, getPlaceInfo, getPlaceData }
