import type { RequestHandler } from '@sveltejs/kit';
import { Destination, destinationFieldsFragment } from '$lib/store/destination';
import { makeErrorResponse } from '$lib/utils/fetch';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { uploadFileFieldsFragment } from '$lib/store/upload-file';
import { countryFieldsFragment } from '$lib/store/country';
/**
 * @type {import('@sveltejs/kit').Put}
 */

export type updateDestinationData = {
	updateDestination: {
		destination: Destination;
	};
};
export const put: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
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
			${countryFieldsFragment}
		`;
		const reqBody = await event.request.json();
		const res = await client
			.mutation<updateDestinationData>(query, { id: event.params.id, updateData: reqBody })
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

	return makeErrorResponse(
		500,
		'INTERNAL_SERVER_ERROR',
		'Error retrieving data for the destination'
	);
};
