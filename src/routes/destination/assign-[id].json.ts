import type { RequestHandler, Request } from '@sveltejs/kit';
import { makeErrorResponse } from '$lib/utils/fetch';
import type { Rec } from '@sveltejs/kit/types/helper';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { uploadFileFieldsFragment } from '$lib/store/upload-file';
import type { Destination } from '$lib/store/destination';
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
export const put: RequestHandler = async (request: Request<Rec<any>, AuthForm>) => {
	try {
		const client = createGraphClientFromRequest(request);
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
		const res = await client
			.mutation<assignDestinationData>(query, {
				id: request.params.id,
				destinations: request.body.destinationIds
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
		console.error('Error updating destination', error);
	}

	return makeErrorResponse(
		500,
		'INTERNAL_SERVER_ERROR',
		'Error retrieving data for the destination'
	);
};
