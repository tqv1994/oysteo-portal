import type { RequestHandler, Request } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeErrorResponse } from '$lib/utils/fetch';
import type { Rec } from '@sveltejs/kit/types/helper';
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

export const put: RequestHandler = async (request: Request<Rec<any>, AuthForm>) => {
	try {
		const client = createGraphClientFromRequest(request);
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
		const res = await client
			.mutation<UpdateUserData>(query, { id: request.locals.user?.id, me: request.body })
			.toPromise();
		if (res.data) {
			return {
				body: JSON.stringify(res.data)
			};
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error updating me', error);
	}
	return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error retrieving data for the me');
};
