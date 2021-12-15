import { extractSetCookieHeader, getSessionCookie } from '$lib/utils/session';
import { cmsUrlPrefix } from '$lib/utils/_env';
import type { Request, RequestHandler } from '@sveltejs/kit';

/**
 * @type {import('@sveltejs/kit').Get}
 */
export const get: RequestHandler = async (request: Request) => {
	try {
		const cookie = getSessionCookie(request.headers.cookie);
		if (cookie) {
			// console.log('we have session cookie...');
			const res = await fetch(`${cmsUrlPrefix}/auth/me`, {
				method: 'DELETE',
				headers: {
					Cookie: cookie
				}
			});
			if (!res.ok) {
				console.error('Error signing out', res);
				return { status: 500 };
			}
			return {
				status: 202,
				headers: extractSetCookieHeader(res.headers)
			};
		}
	} catch (err) {
		console.error('Error fetching profile', err);
		return {
			status: 500,
			body: 'Error'
		};
	}
};
