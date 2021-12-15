import type { RequestHandler, Request } from '@sveltejs/kit';
import { makeErrorResponse } from '$lib/utils/fetch';
import type { Rec } from '@sveltejs/kit/types/helper';
import type { Advisor } from '$lib/store/advisor';
import { cmsUrlPrefix } from '$lib/utils/_env';
import { getSessionCookie } from '$lib/utils/session';
/**
 * @type {import('@sveltejs/kit').Post}
 */

export const post: RequestHandler = async (request: Request<Rec<any>, AuthForm>) => {
	try {
		const cookie = getSessionCookie(request.headers.cookie);
		if (cookie) {
			const res = await fetch(`${cmsUrlPrefix}/advisors/createAdvisor`, {
				headers: {
					Cookie: cookie
				},
				method: "POST",
				body: JSON.stringify(request.body)
			});
			if (res.ok) {
				const body: Advisor = await res.json();
				console.log(body);
				return {
					body,
				};
			} else {
				let error = await res.json();
				return makeErrorResponse(
					500,
					'INTERNAL_SERVER_ERROR',
					error.message
				);
			}
		}
	} catch (error) {
		console.error('Error creating advisor of agency', error.error);
	}

	return makeErrorResponse(
		500,
		'INTERNAL_SERVER_ERROR',
		'Error retrieving data for the advisor of agency'
	);
};
