import { cmsUrlPrefix } from '$lib/env';
import type { Auth } from '$lib/store/auth';
import type { RequestHandler } from '@sveltejs/kit';
import { filterUnsafeHeaders } from '../p/[...path]';

/**
 * @type {import('@sveltejs/kit').Post}
 */
export const post: RequestHandler = async ({ locals, request }) => {
	try {
		const { token } = await request.json();

		const res = await fetch(`${cmsUrlPrefix}/auth`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token
			}
		});
		const headers = filterUnsafeHeaders(res.headers);

		if (res.ok) {
			const authRes: Auth = await res.json();
			locals.user = authRes.user;
			locals.advisorMe = authRes.advisorMe;
			locals.agencyMe = authRes.agencyMe;
			return new Response(JSON.stringify(authRes), { headers });
		}
		return {
			status: res.status,
			headers,
			body: await res.text()
		};
	} catch (error) {
		console.error('Error auth', error);
	}
	return { status: 500 };
};
