import type { RequestHandler } from '@sveltejs/kit';
import { makeEmptyResponse } from '$lib/utils/fetch';
import { cmsUrlPrefix } from '$lib/utils/_env';
/**
 * @type {import('@sveltejs/kit').Post}
 */

export const post: RequestHandler = async (event) => {
	try {
		const reqBody = await event.request.json();
		const res = await fetch(`${cmsUrlPrefix}/auth/sendLoginEmail`, {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(reqBody)
		});

		if (res.ok) {
			return new Response(await res.text());
		} else {
			const error = await res.json();
			return makeEmptyResponse(500);
		}
	} catch (error) {
		console.error('Error send mail login', error.error);
	}

	return makeEmptyResponse(500);
};
