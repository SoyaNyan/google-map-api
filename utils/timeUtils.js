// packages
import moment from 'moment'

// format opening hours
const formatOpeningHours = (hourStr) => {
	// 24h
	if (hourStr === '24시간 영업') {
		return {
			isOpen: true,
			start: '00:00',
			end: '00:00',
		}
	}

	// closed today
	if (hourStr === '휴무일') {
		return {
			isOpen: false,
		}
	}

	// format time
	const [start, end] = hourStr.replace('오전', 'AM').replace('오후', 'PM').split('~')
	const startTime = moment(start, 'a h:mm').format('HH:mm')
	const endTime = moment(end, 'a h:mm').format('HH:mm')

	// open
	return {
		isOpen: true,
		start: startTime,
		end: endTime,
	}
}

export { formatOpeningHours }
