export function isValidEmail(email: string) {
	return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
		email.trim()
	);
}

export function isPasswordComplex(password: string) {
	const re = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})');
	return re.test(password);
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
	if (status == true) {
		message =
			'Password must be at least 8 characters (Including 1 uppercase letter, 1 number and 1 lowercase letter).';
	}
	return {
		status,
		message
	};
}

export function capitalizeFirstLetter(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export const queryURLParamToJSON = (query: string) => {
	const re = /([^&=]+)=?([^&]*)/g;
	const decodeRE = /\+/g;

	const decode = function (str: string) {
		return decodeURIComponent(str.replace(decodeRE, ' '));
	};

	const params: any = {};
	let e;
	while ((e = re.exec(query))) {
		let k = decode(e[1]),
			v = decode(e[2]);
		if (k.substring(k.length - 2) === '[]') {
			k = k.substring(0, k.length - 2);
			(params[k] || (params[k] = [])).push(v);
		} else params[k] = v;
	}

	const assign = function (obj: any, keyPath: string, value: any) {
		const lastKeyIndex = keyPath.length - 1;
		for (let i = 0; i < lastKeyIndex; ++i) {
			const key = keyPath[i];
			if (!(key in obj)) obj[key] = {};
			obj = obj[key];
		}
		obj[keyPath[lastKeyIndex]] = value;
	};

	for (const prop in params) {
		const structure = prop.split('[');
		if (structure.length > 1) {
			const levels: any = [];
			structure.forEach(function (item, i) {
				const key = item.replace(/[?[\]\\ ]/g, '');
				levels.push(key);
			});
			assign(params, levels, params[prop]);
			delete params[prop];
		}
	}
	return params;
};

export const formatNumber = (num) => {
	const p = num.toFixed(0);
	return p
		.split('')
		.reverse()
		.reduce(function (acc, num, i, orig) {
			return num + (num != '-' && i && !(i % 3) ? ',' : '') + acc;
		}, '');
};

export const isInstagram = (str: string) => {
	if (str.indexOf('@') == 0) {
		return true;
	}
	return false;
};

export function getFormValues(form: HTMLFormElement): Record<string, string | number> {
  if (!form) {
    return {};
  }
	return Array.from(form.elements).reduce((acc, el: HTMLInputElement) => {
		if (el.name) {
			acc[el.name] = el.value;
		}
		return acc;
	}, {});
}
