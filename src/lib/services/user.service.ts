import { isValidEmail } from '$lib/helpers/utils';
import type { User, UserInput } from '$lib/store/auth';

export const updateUserService = async (id: string | number, input: UserInput): Promise<User> => {
	return new Promise(async (resolve, reject) => {
		const res = await fetch(`/user/update-${id}.json`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...input
			})
		});
		if (res.ok) {
			const data: User = await res.json();
			resolve(data);
		} else {
			const error = await res.json();
			reject(error);
		}
	});
};

export const sendEmailVerificationLink = async (email: string): Promise<void> => {
	if (!email || !isValidEmail(email)) {
		return Promise.reject();
	}
	return new Promise<void>((resolve, reject) => {
		fetch(`/auth/send-email-verification-link.json`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email })
		})
			.then(() => resolve())
			.catch(reject);
	});
};

export const sendLoginEmail = async (email: string): Promise<User> => {
	return new Promise(async (resolve, reject) => {
		const res = await fetch(`/auth/send-mail-login.json`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email
			})
		});
		if (res.ok) {
			const data: User = await res.json();
			resolve(data);
		} else {
			const error = await res.json();
			reject(error);
		}
	});
};
