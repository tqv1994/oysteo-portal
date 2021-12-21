import type { RequestHandler, Request } from '@sveltejs/kit';
import { makeErrorResponse } from '$lib/utils/fetch';
import type { Rec } from '@sveltejs/kit/types/helper';
import { cmsUrlPrefix } from '$lib/utils/_env';
import { extractSetCookieHeader, getSessionCookie } from '$lib/utils/session';
/**
 * @type {import('@sveltejs/kit').Post}
 */

export const put: RequestHandler = async (request: Request<Rec<any>, AuthForm>) => {
    try {
        const cookie = getSessionCookie(request.headers.cookie);
        if (cookie) {
            const res = await fetch(`${cmsUrlPrefix}/auth/change-password`, {
                method: 'PUT',
                body: JSON.stringify(request.body),
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: cookie
                },
            });
            if (res.ok) {
                const body = await res.json();
                return {
                    body,
                    headers: extractSetCookieHeader(res.headers)
                };
            } else {
                let error = await res.json();
                return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', error.message);
            }
        }
    } catch (error) {
        console.error('Error change password', error);
    }

    return makeErrorResponse(
        500,
        'INTERNAL_SERVER_ERROR',
        'Error change password'
    );
};
