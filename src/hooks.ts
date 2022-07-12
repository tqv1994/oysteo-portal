import { getSessionCookie } from '$lib/utils/session';
import { makeEmptyResponse } from '$lib/utils/fetch';
import type { GetSession, Handle } from '@sveltejs/kit';
import { cmsUrlPrefix } from '$lib/env';
import type { Auth } from '$lib/store/auth';

let counter = 0;

/** @type {import('@sveltejs/kit').Handle} */
export const handle: Handle = async ({ event, resolve }) => {
	const { request, url, locals } = event;
	const logPrefix = `${++counter}\t${request.method}\t`;
	const logSuffix = `${url.pathname} ${url.searchParams.toString()} `;
	const dashes = url.pathname.startsWith('/p/') ? '---' : '-';
	console.debug(logPrefix, `${dashes}>`, logSuffix);

	const cookie = request.headers.get('cookie');
	if (cookie) {
		const sessionCookie = getSessionCookie(cookie);
		if (sessionCookie) {
			try {
				const res = await fetch(`${cmsUrlPrefix}/auth`, {
					headers: { cookie, Accept: 'application/json' }
				});
				if (res.ok) {
					const authRes: Auth = await res.json();
					locals.user = authRes.user;
					locals.advisorMe = authRes.advisorMe;
					locals.agencyMe = authRes.agencyMe;
				} else if (res.status === 401) {
					locals.user = undefined;
					locals.agencyMe = undefined;
					locals.advisorMe = undefined;
					return new Response(await res.text(), {
						status: res.status,
						headers: {
							'set-cookie':
								'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT, session.sig=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly'
						}
					});
				} else {
					console.error('Hook', res.status, await res.text());
				}
			} catch (err) {
				console.error('Error fetching profile', err);
			}
		}
	}

	try {
		const response = await resolve(event);
		console.debug(logPrefix, `<${dashes}`, logSuffix, response.status);
		return response;
	} catch (err) {
		console.error(`There was an error loading ${url.pathname}: ${err.message}`);
		return makeEmptyResponse(500);
	}
};

/** @type {import('@sveltejs/kit').GetSession} */
export const getSession: GetSession = async (event) => {
	return {
		...event.locals
	};
};
