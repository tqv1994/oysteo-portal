import * as cookie from 'cookie';
import type { ResponseHeaders } from '@sveltejs/kit/types/helper';

export function getSessionCookie(cookieString: string): string {
	if (cookieString) {
		const cookies = cookie.parse(cookieString);
		const { session, 'session.sig': sig } = cookies;
		if (session && sig) {
			return `session=${session};session.sig=${sig}`;
		}
	}
	return '';
}

export function extractSetCookieHeader(headers: Headers): ResponseHeaders {
	if (headers.has('set-cookie')) {
		const cookieString = headers.get('set-cookie') || '';
		const parts = cookieString.split(', session.sig=');
		if (parts.length === 2 && parts[0].startsWith('session=')) {
			return {
				'set-cookie': [parts[0], 'session.sig=' + parts[1]]
			};
		}
	}
	return {};
}
