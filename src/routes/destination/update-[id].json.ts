import type { RequestHandler, Request } from '@sveltejs/kit';
import { Destination, destinationFieldsFragment } from '$lib/store/destination';
import { makeErrorResponse } from '$lib/utils/fetch';
import type { Rec } from '@sveltejs/kit/types/helper';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { uploadFileFieldsFragment } from '$lib/store/upload-file';
/**
 * @type {import('@sveltejs/kit').Put}
 */

export type updateDestinationData = {
	updateDestination: {
		destination: Destination;
	};
};
export const put: RequestHandler = async (request: Request<Rec<any>, AuthForm>) => {
	try {
		const client = createGraphClientFromRequest(request);
		const query = `
			mutation updateDestination($id: ID!, $updateData: editDestinationInput ){
				updateDestination(input:{
					where: {id: $id},
					data: $updateData
                }) 
				{
                    destination {
                        ...destinationFields
                    }
				}
			}	  
			${destinationFieldsFragment}
            ${uploadFileFieldsFragment}
		`;
		const res = await client
			.mutation<updateDestinationData>(query, { id: request.params.id, updateData: request.body })
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
