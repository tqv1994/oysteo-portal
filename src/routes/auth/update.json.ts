import type { RequestHandler } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeErrorResponse } from '$lib/utils/fetch';
import { User, userFieldsFragment } from '$lib/store/auth';
import { uploadFileFieldsFragment } from '$lib/store/upload-file';
/**
 * @type {import('@sveltejs/kit').Post}
 */
export type UpdateUserData = {
	updateUser: {
		user: User;
	};
};

export const put: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
		const query = `mutation updateMe ($id: ID!, $me: editUserInput){
        updateUser(input:{
          where: {id: $id},
          data: $me
        }) {
            user{
                ...userFields
            }
          }
      }
      ${userFieldsFragment}
      ${uploadFileFieldsFragment}
    `;
		const reqBody = await event.request.json();
		const res = await client
			.mutation<UpdateUserData>(query, { id: event.locals.user?.id, me: reqBody })
			.toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error updating me', error);
	}
	return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error retrieving data for the me');
};
