import type { RequestHandler } from '@sveltejs/kit';
import { makeEmptyResponse } from '$lib/utils/fetch';
import { cmsUrlPrefix } from '$lib/env';
import { extractSetCookieHeader, getSessionCookie } from '$lib/utils/session';
/**
 * @type {import('@sveltejs/kit').Post}
 */

export const put: RequestHandler = async (event) => {
	try {
		const cookie = getSessionCookie(event.request.headers.get('cookie'));
		if (cookie) {
			const reqBody = await event.request.json();
			const res = await fetch(`${cmsUrlPrefix}/auth/change-password`, {
				method: 'PUT',
				body: JSON.stringify(reqBody),
				headers: {
					'Content-Type': 'application/json',
					Cookie: cookie
				}
			});
			if (res.ok) {
				return new Response(await res.text(), {
					headers: extractSetCookieHeader(res.headers)
				});
			} else {
				const error = await res.json();
				return makeEmptyResponse(500);
			}
		}
	} catch (error) {
		console.error('Error change password', error);
	}

	return makeEmptyResponse(500);
};
