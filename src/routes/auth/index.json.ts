import { cmsUrlPrefix } from '$lib/utils/_env';
import { extractSetCookieHeader } from '$lib/utils/session';
import type { RequestHandler } from '@sveltejs/kit';
import { makeEmptyResponse } from '$lib/utils/fetch';
/**
 * @type {import('@sveltejs/kit').Post}
 */
export const post: RequestHandler = async (event) => {
	const reqBody = await event.request.json();
	const token = reqBody.token;
	if (!token) {
		return makeEmptyResponse(400);
	}

	try {
		const res = await fetch(`${cmsUrlPrefix}/auth/me`, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token
			},
			body:JSON.stringify({kind: reqBody.kind || ''})
		});
		return new Response(await res.text(), {
			status: res.status,
			headers: extractSetCookieHeader(res.headers)
		});
	} catch (error) {
		console.error('Error signing in in auth', error);
    return makeEmptyResponse(500)
	}
};
