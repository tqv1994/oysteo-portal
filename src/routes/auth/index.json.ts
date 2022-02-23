import { goto } from '$app/navigation';
import { cmsUrlPrefix } from '$lib/utils/_env';
import { extractSetCookieHeader } from '$lib/utils/session';
import type { User } from '$lib/store/user';
import type { RequestHandler } from '@sveltejs/kit';
import { makeErrorResponse } from '$lib/utils/fetch';
/**
 * @type {import('@sveltejs/kit').Post}
 */
export const post: RequestHandler = async (event) => {
	const reqBody = await event.request.json();
	const token = reqBody.token;
	if (!token) {
		return makeErrorResponse(400, 'MISSING_ID_TOKEN', 'ID token is required');
	}

	try {
		const res = await fetch(`${cmsUrlPrefix}/auth/me`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token
			}
		});
		return new Response(await res.text(), {
			status: res.status,
			headers: extractSetCookieHeader(res.headers)
		});
	} catch (error) {
		console.error('Error signing in in auth', error);
		goto('/login');
	}
};
