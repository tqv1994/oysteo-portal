import type { Agency } from '$lib/store/agency';
import { makeErrorResponse } from '$lib/utils/fetch';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import type { RequestHandler, Request } from '@sveltejs/kit';
import type { Rec } from '@sveltejs/kit/types/helper';

export type createAgencyData = {
	createAgency: {
		agency: Agency;
	};
};
/**
 * @type {import('@sveltejs/kit').Post}
 */
export const post: RequestHandler = async (request: Request<Rec<any>, AuthForm>) => {
	try {
		const client = createGraphClientFromRequest(request);
		const query = `
		mutation createAgency ($agency: AgencyInput){
            createAgency(input:{data: $agency}){
            agency{
                id
              }    
            }
          }
		`;
		const res = await client
			.mutation<createAgencyData>(query, { agency: request.body })
			.toPromise();
		if (res.data) {
			return {
				body: JSON.stringify(res.data.createAgency.agency)
			};
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error creating advisor', error);
	}

	return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error retrieving data for the advisor');
};
