import { INVALID_DELAY_TIME } from '$lib/utils/constants';

export function validateEmail(email: string) {
	if (email == null || email == '') {
		return true;
	}
	return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
		email
	);
}

export function validateWebsite(website: string): boolean {
	if (website == null || website == '') {
		return true;
	}
	return /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi.test(
		website
	);
}

function* iter_range(begin: number, end: number, step: number) {
	// Normalize our inputs
	step = step ? step : 1;

	if (typeof end === 'undefined') {
		end = begin > 0 ? begin : 0;
		begin = begin < 0 ? begin : 0;
	}

	if (begin == end) {
		return;
	}

	if (begin > end) {
		step = step * -1;
	}

	for (let x = begin; x < end; x += step) {
		yield x;
	}
}

export function range(begin: number, end: number, step: number) {
	return Array.from(iter_range(begin, end, step));
}

export function separateFirstAndLastName(name: string) {
	let firstName = '',
		lastName = '';
	const nameArray = name.split(/\s+/);
	if (nameArray.length == 1) {
		lastName = nameArray.pop();
	} else {
		lastName = nameArray.pop();
		firstName = nameArray.join(' ');
	}
	return {
		firstName,
		lastName
	};
}

type AdvisorName = {
	firstName: string;
	lastName: string;
};

export function mergeName(nameObject: AdvisorName): string {
	return nameObject.firstName + ' ' + nameObject.lastName;
}

function checkLowerCase(str: string): boolean {
	return /[a-z]/.test(str);
}

function checkUpperCase(str: string): boolean {
	return /[A-Z]/.test(str);
}

function checkDigit(str: string): boolean {
	return /[0-9]/.test(str);
}

export function checkPasswordRule(password: string) {
	let status = false,
		message = '';
	if (password == null || password == '') {
		return {
			status,
			message
		};
	}
	if (password.length < 8) {
		status = true;
	} else if (!checkUpperCase(password)) {
		status = true;
	} else if (!checkDigit(password)) {
		status = true;
	} else if (!checkLowerCase(password)) {
		status = true;
	}
	if(status == true){
		message = 'Password must be at least 8 characters (Including 1 uppercase letter, 1 number and 1 lowercase letter).';
	}
	return {
		status,
		message
	};
}

export function capitalizeFirstLetter(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
