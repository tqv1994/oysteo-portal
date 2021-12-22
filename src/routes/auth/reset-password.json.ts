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
        const res = await fetch(`${cmsUrlPrefix}/auth/reset-password`, {
            method: 'POST',
            body: JSON.stringify(request.body),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (res.ok) {
            const body = await res.json();
            return {
                body
            };
        } else {
            let error = await res.json();
            console.log(error);
            return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', error.message);
        }
    } catch (error) {
        console.error('Error reset password', error);
    }

    return makeErrorResponse(
        500,
        'INTERNAL_SERVER_ERROR',
        'Error reset password'
    );
};
