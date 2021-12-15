import type { RequestHandler, Request } from '@sveltejs/kit';
import { makeErrorResponse } from '$lib/utils/fetch';
import type { Rec } from '@sveltejs/kit/types/helper';
import type { AdvisorAgency } from '$lib/store/advisor';
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
export const put: RequestHandler = async (request: Request<Rec<any>, AuthForm>) => {
	try {
		const client = createGraphClientFromRequest(request);

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

		const res = await client
			.mutation<assignAdvisorAgencyData>(query, {
				id: request.params.id,
				advisors: request.body.advisorIds
			})
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
		console.error('Error assign advisor for agency', error);
	}

	return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error retrieving data for the agency');
};
