import type { RequestHandler, Request } from '@sveltejs/kit';
import { extractSetCookieHeader, getSessionCookie } from '$lib/utils/session';
import { cmsUrlPrefix } from '$lib/utils/_env';
import type { Rec } from '@sveltejs/kit/types/helper';
/**
 * @type {import('@sveltejs/kit').Delete}
 */
export const del: RequestHandler = async (request: Request<Rec<any>, AuthForm>) => {
	try {
		const data = request.body.data;
		const cookie = getSessionCookie(request.headers.cookie);
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
				return { status: 500 };
			}
			return {
				status: 202,
				headers: extractSetCookieHeader(res.headers)
			};
		}
	} catch (err) {
		console.error('Error deleting file', err);
		return {
			status: 500,
			body: 'Error'
		};
	}
};
