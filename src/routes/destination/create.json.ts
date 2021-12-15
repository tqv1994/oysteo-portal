import type { RequestHandler, Request } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeErrorResponse } from '$lib/utils/fetch';
import type { Rec } from '@sveltejs/kit/types/helper';
import { Destination, destinationFieldsFragment } from '$lib/store/destination';
import { uploadFileFieldsFragment } from '$lib/store/upload-file';
/**
 * @type {import('@sveltejs/kit').Post}
 */
export type createDestinationData = {
	createDestination: {
		destination: Destination;
	};
};

export const post: RequestHandler = async (request: Request<Rec<any>, AuthForm>) => {
	try {
		const client = createGraphClientFromRequest(request);
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
    `;
		const res = await client
			.mutation<createDestinationData>(query, { destination: request.body })
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
		console.error('Error create data for the destination', error);
	}
	return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error creating data for the destination');
};
