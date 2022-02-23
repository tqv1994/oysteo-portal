import { makeErrorResponse } from '$lib/utils/fetch';
import { extractSetCookieHeader, getSessionCookie } from '$lib/utils/session';
import { cmsUrlPrefix } from '$lib/utils/_env';
import type { Request, RequestHandler } from '@sveltejs/kit';

/**
 * @type {import('@sveltejs/kit').Get}
 */
export const get: RequestHandler = async (event) => {
	try {
		const cookie = getSessionCookie(event.request.headers.get('cookie'));
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
				return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Failed to sign out');
			}
			return new Response('', {
				status: 202,
				headers: extractSetCookieHeader(res.headers)
			});
		}
	} catch (err) {
		console.error('Error fetching profile', err);
    return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Failed to sign out')
	}
};
