import type { RequestHandler, Request } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeErrorResponse } from '$lib/utils/fetch';
import type { Rec } from '@sveltejs/kit/types/helper';
import type { User } from '$lib/store/auth';

export type UpdateUserData = {
    updateUser: {
        user: User
    };
};

export const put: RequestHandler = async (
    request: Request<Rec<any>, AuthForm>) => {
    try {
        const client = createGraphClientFromRequest(request);
        const query = `mutation ($id: ID!,$user: editUserInput){
        updateUser(input:{
            where: {id: $id},
            data: $user
            }) {
                user{
                    id,
                    myAdvisors{
                        id,
                        name
                    }
                }
            }
        }
    `;
        const res = await client.mutation<UpdateUserData>(query, { id: request.params.id || '', user: request.body }).toPromise();
        if (res.data) {
            return {
                body: JSON.stringify(res.data.updateUser?.user),
            };
        }
        if (res.error) {
            console.log(JSON.stringify(res.error, null, 2));
        }
    } catch (error) {
        console.error('Error update data for the user', error);
    }
    return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error updating data for the user');
};