import type { RequestHandler } from '@sveltejs/kit';
import { makeEmptyResponse } from '$lib/utils/fetch';
import { createGraphClientFromRequest } from '$lib/utils/graph';

/**
 * @type {import('@sveltejs/kit').Put}
 */

export type assignAdvisorAgencyData = {
	updateAgency: {
		agency: {
			advisors: string[];
		};
	};
};
export const put: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);

		const query = `
        mutation updateAgency($id: ID!, $advisors: [ID]){
            updateAgency(input: { 
              where : {id : $id },
              data: {advisors: $advisors}
          }) 
            {
              agency {
                advisors{
                  id
                }
              }
            }
          }	  
         `;

		const reqBody = await event.request.json();

		const res = await client
			.mutation<assignAdvisorAgencyData>(query, {
				id: event.params.id,
				advisors: reqBody.advisorIds
			})
			.toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error assign advisor for agency', error);
	}

	return makeEmptyResponse(500);
};
