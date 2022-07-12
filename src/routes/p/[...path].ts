import { cmsUrlPrefix } from '$lib/env';
import type { RequestHandler } from '@sveltejs/kit';

const SAFE_RESPONSE_FILTERS = ['set-cookie', 'content-type', 'content-length'];
const BLOCKED_PATHS = { '': true, undefined: true };
const BLOCKED_PATH_PREFIXES = ['admin', 'graphql'];

/**
 * @type {import('@sveltejs/kit').Post}
 */

const proxy: RequestHandler = async ({ request, params, url }) => {
	if (isBlocked(params.path)) {
		return { status: 404 };
	}
	try {
		request.headers.delete('host');
		request.headers.delete('connection');
		const res = await fetch(`${cmsUrlPrefix}/${params.path}${url.search}`, request);
		const body = await res.text();
		const headers = filterUnsafeHeaders(res.headers);
		return new Response(body, {
			headers,
			status: res.status,
			statusText: res.statusText
		});
	} catch (error) {
		console.error('Error', request.method, params.path, error);
	}
	return { status: 500 };
};

function isBlocked(path: string): boolean {
	if (BLOCKED_PATHS[path]) {
		return true;
	}
	for (const p of BLOCKED_PATH_PREFIXES) {
		if (path.startsWith(p)) {
			return true;
		}
	}
	return false;
}

export const get: RequestHandler = proxy;
export const post: RequestHandler = proxy;
export const patch: RequestHandler = proxy;
export const put: RequestHandler = proxy;
export const del: RequestHandler = proxy;

export function filterUnsafeHeaders(headers: Headers): Headers {
	const h = new Headers(headers);
	h.forEach((_, key) => {
		if (!SAFE_RESPONSE_FILTERS.includes(key)) {
			h.delete(key);
		}
	});
	return h;
}
