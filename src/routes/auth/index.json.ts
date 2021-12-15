import { goto } from '$app/navigation';
import { cmsUrlPrefix } from '$lib/utils/_env';
import { extractSetCookieHeader } from '$lib/utils/session';
import type { User } from '$lib/store/user';
import type { RequestHandler, Request } from '@sveltejs/kit';
/**
 * @type {import('@sveltejs/kit').Post}
 */
export const post: RequestHandler = async (request: Request<Record<string, any>, any>) => {
	const token = request.body.token;
	if (!token) {
		return {
			status: 400,
			body: JSON.stringify({
				message: 'ID token is required'
			})
		};
	}

	try {
		const res = await fetch(`${cmsUrlPrefix}/auth/me`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token
			}
		});
		const body: User = await res.json();
		return {
			status: res.status,
			body,
			headers: extractSetCookieHeader(res.headers)
		};
	} catch (error) {
		console.error('Error signing in in auth', error);
		goto('/login');
	}
};
