import type { RequestHandler } from '@sveltejs/kit';
import { makeErrorResponse } from '$lib/utils/fetch';
import type { Advisor } from '$lib/store/advisor';
import { cmsUrlPrefix } from '$lib/utils/_env';
import { getSessionCookie } from '$lib/utils/session';
/**
 * @type {import('@sveltejs/kit').Post}
 */

export const post: RequestHandler = async (event) => {
    try {
        const reqBody = await event.request.json();
        const res = await fetch(`${cmsUrlPrefix}/auth/forgot-password`, {
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (res.ok) {
            const body = await res.text();
            return new Response(body);
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
