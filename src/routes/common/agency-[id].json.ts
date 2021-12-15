import type { RequestHandler, Request } from '@sveltejs/kit';
import { makeErrorResponse } from '$lib/utils/fetch';
import type { Rec } from '@sveltejs/kit/types/helper';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import type { Agency } from '$lib/store/agency';
import {
	affiliatteAgencyFieldsFragment,
	affiliatteNetworkFieldsFragment
} from '$lib/store/affiliate';
/**
 * @type {import('@sveltejs/kit').Put}
 */
export const put: RequestHandler = async (request: Request<Rec<any>, AuthForm>) => {
	try {
		const client = createGraphClientFromRequest(request);
		const body = request.body;

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
		const res = await client
			.mutation<Agency>(query, { id: request.params.id, updateData: body })
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
		console.error('Error updating agency', error);
	}

	return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error retrieving data for the agency');
};
