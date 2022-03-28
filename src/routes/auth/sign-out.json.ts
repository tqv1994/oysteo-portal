import { getSessionCookie } from '$lib/utils/session';
import { cmsUrlPrefix } from '$lib/utils/_env';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * @type {import('@sveltejs/kit').Get}
 */
export const get: RequestHandler = async (event) => {
	const cookie = getSessionCookie(event.request.headers.get('cookie'));
	if (cookie) {
		try {
			await fetch(`${cmsUrlPrefix}/auth/sign-out`, {
				method: 'POST',
				headers: {
					Cookie: cookie
				}
			});
		} catch (err) {
			// do nothing
		}
	}

	const headers = new Headers();
	headers.set('Set-Cookie', 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
	headers.append('Set-Cookie', 'session.sig=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly');

	return new Response('', {
		status: 204,
		headers
	});
};
