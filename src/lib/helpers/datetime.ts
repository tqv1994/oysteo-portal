import { TIME_ZONES } from '$lib/utils/constants';

export function normalizeInputDatePicker(date: string) {
	if (date == '' || date == null) {
		return null;
	}
	const arr = date.split('/');
	if (arr.length < 3) {
		return date;
	}
	return arr[2] + '-' + formatDateMonth(arr[0]) + '-' + formatDateMonth(arr[1]);
}

export function formatOutputDatePicker(date: string) {
	if (date == '' || date == null) {
		return '';
	}
	const arr = date.split('-');
	if (arr.length < 3) {
		return date;
	}
	return arr[1] + '/' + arr[2] + '/' + arr[0];
}

export function formatMonthAndYear(date: string) {
	if (date == '' || date == null) {
		return '';
	}
	var myDate = new Date(date);
	var months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	return months[myDate.getMonth()] + ', ' + myDate.getFullYear();
}

export function validateMMDDYYYY(date: string) {
	if (date == '' || date == null) {
		return true;
	}
	return /^([0]?[1-9]|[1][0-2])[./-]([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0-9]{4})$/.test(date);
}

function formatDateMonth(dateMonth: string): string {
	let number = parseInt(dateMonth);
	if (number <= 9) {
		return '0' + number.toString();
	}
	return dateMonth;
}

export function handleDisplayTimeZone(locale: string) {
	if (!locale || locale == '') {
		return '';
	}
	const timeZoneSelected = TIME_ZONES.filter((item) => item.locale == locale)[0];
	return timeZoneSelected.locale.split('/')[1] + ' - ' + timeZoneSelected.gmt;
}
