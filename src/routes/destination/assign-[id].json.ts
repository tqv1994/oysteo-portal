import type { RequestHandler } from '@sveltejs/kit';
import { makeEmptyResponse } from '$lib/utils/fetch';
import { createGraphClientFromRequest } from '$lib/utils/graph';
/**
 * @type {import('@sveltejs/kit').Put}
 */

export type assignDestinationData = {
	updateAdvisor: {
		advisor: {
			destinations: {
				id: string;
			};
		};
	};
};
export const put: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
		const query = `
        mutation updateAdvisor($id: ID!, $destinations: [ID]){
          updateAdvisor(input: { 
            where : {id : $id },
            data: {destinations: $destinations}
        }) 
          {
            advisor {
              destinations{
                id
              }
            }
          }
        }
      `;
		const reqBody = await event.request.json();
		const res = await client
			.mutation<assignDestinationData>(query, {
				id: event.params.id,
				destinations: reqBody.destinationIds
			})
			.toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error updating destination', error);
	}

	return makeEmptyResponse(
		500,
		'INTERNAL_SERVER_ERROR',
		'Error retrieving data for the destination'
	);
};
