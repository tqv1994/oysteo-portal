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
	const myDate = new Date(date);
	const months = [
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
	return months[myDate.getMonth()] + ' ' + myDate.getFullYear();
}

export function validateMMDDYYYY(date: string) {
	if (date == '' || date == null) {
		return true;
	}
	return /^([0]?[1-9]|[1][0-2])[./-]([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0-9]{4})$/.test(date);
}

function formatDateMonth(dateMonth: string): string {
	const number = parseInt(dateMonth);
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

export const formatDate = (date) => {
	const dateData = new Date(date);
	const month = dateData.toLocaleString('en', { month: 'long' });
	return `${month} ${dateData.getDate()}, ${dateData.getFullYear()}`;
};

export const dateDiffInDays = (d1, d2) => {
	const t2 = new Date(d2).getTime();
	const t1 = new Date(d1).getTime();

	return Math.floor((t2 - t1) / (24 * 3600 * 1000));
};
