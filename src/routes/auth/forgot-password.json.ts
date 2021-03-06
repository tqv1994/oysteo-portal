import type { RequestHandler } from '@sveltejs/kit';
import { makeEmptyResponse } from '$lib/utils/fetch';
import type { Advisor } from '$lib/store/advisor';
import { cmsUrlPrefix } from '$lib/env';
import { getSessionCookie } from '$lib/utils/session';
/**
 * @type {import('@sveltejs/kit').Post}
 */

export const post: RequestHandler = async (event) => {
	try {
		const reqBody = await event.request.json();
		const res = await fetch(`${cmsUrlPrefix}/auth/forgot-password`, {
			method: 'POST',
			body: JSON.stringify(reqBody),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (res.ok) {
			const body = await res.text();
			return new Response(body);
		} else {
			const error = await res.json();
			console.error(error);
			return makeEmptyResponse(500);
		}
	} catch (error) {
		console.error('Error reset password', error);
	}

	return makeEmptyResponse(500);
};
