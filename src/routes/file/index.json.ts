import type { RequestHandler } from '@sveltejs/kit';
import { extractSetCookieHeader, getSessionCookie } from '$lib/utils/session';
import { cmsUrlPrefix } from '$lib/utils/_env';
import { makeErrorResponse } from '$lib/utils/fetch';
/**
 * @type {import('@sveltejs/kit').Delete}
 */
export const del: RequestHandler = async (event) => {
	try {
		const reqBody = await event.request.json();
		const data = reqBody.data;
		const cookie = getSessionCookie(event.request.headers.get('cookie'));
		if (cookie) {
			const res = await fetch(cmsUrlPrefix + `/upload/files/${data}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Cookie: cookie
				}
			});
			if (!res.ok) {
				console.error('Error delete file', res);
				return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Failed to sign out');
			}
			return new Response('', {
				status: 202,
				headers: extractSetCookieHeader(res.headers)
			});
		}
	} catch (err) {
		console.error('Error deleting file', err);
    return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Failed to sign out')
	}
};
