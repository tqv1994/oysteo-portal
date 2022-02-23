import type { RequestHandler } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeErrorResponse } from '$lib/utils/fetch';
import { Destination, destinationFieldsFragment } from '$lib/store/destination';
import { uploadFileFieldsFragment } from '$lib/store/upload-file';
import { countryFieldsFragment } from '$lib/store/country';
/**
 * @type {import('@sveltejs/kit').Post}
 */
export type createDestinationData = {
	createDestination: {
		destination: Destination;
	};
};

export const post: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
		const query = `mutation createDestination ($destination: DestinationInput){
        createDestination(input:{
          data: $destination
        }) {
            destination{
                ...destinationFields
            }
        }
      }
	  ${destinationFieldsFragment}
	  ${uploadFileFieldsFragment}
	  ${countryFieldsFragment}
    `;
	console.log(query);
	
		const reqBody = await event.request.json();
		const res = await client
			.mutation<createDestinationData>(query, { destination: reqBody })
			.toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error create data for the destination', error);
	}
	return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error creating data for the destination');
};
