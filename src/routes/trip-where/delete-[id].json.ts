import type { RequestHandler, Request } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeErrorResponse } from '$lib/utils/fetch';
import type { TripWhere } from '$lib/store/tripWhere';
/**
 * @type {import('@sveltejs/kit').Post}
 */
export type deleteTripWhereData = {
    deleteTripWhere: {
        tripWhere: TripWhere
    };
};

export const del: RequestHandler = async (request: Request) => {
    try {
        const client = createGraphClientFromRequest(request);
        const query = `mutation deleteTripWhere ($id: ID!){
        deleteTripWhere(input:{
            where: {id: $id},
            }) {
                tripWhere{
                    id
                }
            }
        }
    `;
        const res = await client.mutation<deleteTripWhereData>(query, {id:request.params.id || '' }).toPromise();
        if (res.data) {
            return {
                body: JSON.stringify(res.data.deleteTripWhere?.tripWhere),
            };
        }
        if (res.error) {
            console.log(JSON.stringify(res.error, null, 2));
        }
    } catch (error) {
        console.error('Error delete data for the trip where', error);
    }
    return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error deleting data for the trip where');
};