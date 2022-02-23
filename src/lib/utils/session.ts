import * as cookie from 'cookie';

export function getSessionCookie(cookieString?: string | null): string {
	if (cookieString) {
		const cookies = cookie.parse(cookieString);
		const { session, 'session.sig': sig } = cookies;
		if (session && sig) {
			return `session=${session};session.sig=${sig}`;
		}
	}
	return '';
}

export function extractSetCookieHeader(headers: Headers): HeadersInit {
	if (headers.has('set-cookie')) {
		const cookieString = headers.get('set-cookie') || '';
		const parts = cookieString.split(', session.sig=');
		if (parts.length === 2 && parts[0].startsWith('session=')) {
			const headers = new Headers();
			headers.set('set-cookie', cookieString);
			return headers;
		}
	}
	return {};
}
