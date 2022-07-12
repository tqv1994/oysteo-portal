import type { RequestHandler } from '@sveltejs/kit';
import { makeEmptyResponse } from '$lib/utils/fetch';
import { cmsUrlPrefix } from '$lib/env';
import { getSessionCookie } from '$lib/utils/session';
/**
 * @type {import('@sveltejs/kit').Post}
 */

export const post: RequestHandler = async (event) => {
	try {
		const cookie = getSessionCookie(event.request.headers.get('cookie'));
		if (cookie) {
			const reqBody = await event.request.json();
			const res = await fetch(`${cmsUrlPrefix}/advisors/reSendInvitation`, {
				headers: {
					Cookie: cookie,
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
		}
	} catch (error) {
		console.error('Error reSend Invitation advisor of agency', error.error);
	}

	return makeEmptyResponse(500);
};
