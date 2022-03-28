import { cmsUrlPrefix } from '$lib/utils/_env';
import type { RequestHandler } from '@sveltejs/kit';
import { makeEmptyResponse } from '$lib/utils/fetch';
/**
 * @type {import('@sveltejs/kit').Post}
 */
export const post: RequestHandler = async (event) => {
	try {
		const { email, password } = await event.request.json();
		if (!email || !password) {
			return makeEmptyResponse(400);
		}
		const res = await fetch(`${cmsUrlPrefix}/auth/register-agency`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		});
		return makeEmptyResponse(res.status);
	} catch (error) {
		console.error('Error registering agency', error);
		return makeEmptyResponse(500);
	}
};
