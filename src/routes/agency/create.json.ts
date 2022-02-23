import type { Agency } from '$lib/store/agency';
import { makeErrorResponse } from '$lib/utils/fetch';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import type { RequestHandler } from '@sveltejs/kit';

export type createAgencyData = {
	createAgency: {
		agency: Agency;
	};
};
/**
 * @type {import('@sveltejs/kit').Post}
 */
export const post: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
		const query = `
		mutation createAgency ($agency: AgencyInput){
            createAgency(input:{data: $agency}){
            agency{
                id
              }    
            }
          }
		`;
		const reqBody = await event.request.json();
		const res = await client
			.mutation<createAgencyData>(query, { agency: reqBody })
			.toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data.createAgency.agency));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error creating advisor', error);
	}

	return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error retrieving data for the advisor');
};
