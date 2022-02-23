import type { RequestHandler } from '@sveltejs/kit';
import { makeErrorResponse } from '$lib/utils/fetch';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import type { Agency } from '$lib/store/agency';
import {
	affiliatteAgencyFieldsFragment,
	affiliatteNetworkFieldsFragment
} from '$lib/store/affiliate';
/**
 * @type {import('@sveltejs/kit').Put}
 */
export const put: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);

		const query = `
		mutation updateAgency ($id: ID!,$updateData: editAgencyInput){
			updateAgency(input: { 
				where: {id: $id},
                data: $updateData
			}) 
			{
				agency {
					id
					affiliate_agencies{
						...affiliateAgencyFields
					}
					affiliate_networks{
						...affiliateNetworkFields
					}
				}
			}
		  }	  
		  ${affiliatteNetworkFieldsFragment}
		  ${affiliatteAgencyFieldsFragment}
		`;
    const reqBody = await event.request.json();
		const res = await client
			.mutation<Agency>(query, { id: event.params.id, updateData: reqBody })
			.toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error updating agency', error);
	}

	return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error retrieving data for the agency');
};
