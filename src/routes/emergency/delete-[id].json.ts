import type { RequestHandler } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeErrorResponse } from '$lib/utils/fetch';
import type { Emergency } from '$lib/store/emergency';

export type deleteEmergencyData = {
	deleteEmergency: {
		emergency: Emergency;
	};
};

export const del: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
		const query = `mutation deleteEmergency ($id: ID!){
        deleteEmergency(input:{
            where: {id: $id},
            }) {
                emergency{
                    id
                }
            }
        }
        `
		const res = await client
			.mutation<deleteEmergencyData>(query, { id: event.params.id || '' })
			.toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data.deleteEmergency.emergency));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error delete data for the emergency', error);
	}
	return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error deleting data for the emergency');
};
