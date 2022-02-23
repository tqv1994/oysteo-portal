import type { RequestHandler } from '@sveltejs/kit';
import type { Advisor } from '$lib/store/advisor';
import { makeErrorResponse } from '$lib/utils/fetch';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import {
	affiliatteAgencyFieldsFragment,
	affiliatteBenefitProgramFieldsFragment,
	affiliatteNetworkFieldsFragment
} from '$lib/store/affiliate';
import { experienceFieldsFragment } from '$lib/store/experience';
/**
 * @type {import('@sveltejs/kit').Put}
 */
export const put: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
		const query = `
		mutation updateAdvisor ($id: ID!,$updateData: editAdvisorInput){
			updateAdvisor(input: { 
				where: {id: $id},
                data: $updateData
			}) 
			{
				advisor {
					id
					affiliate_agencies{
						...affiliateAgencyFields
					}
					affiliate_networks{
						...affiliateNetworkFields
					}
					affiliate_benefit_programs{
						...affiliateBenefitProgramFields
					}
					experiences{
						...experienceFields
					}
				}
			}
		  }	  
		  ${affiliatteNetworkFieldsFragment}
		  ${affiliatteAgencyFieldsFragment}
		  ${affiliatteBenefitProgramFieldsFragment}
		  ${experienceFieldsFragment}
		`;
		const reqBody = await event.request.json();
		const res = await client
			.mutation<Advisor>(query, { id: event.params.id, updateData: reqBody })
			.toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error updating advisor', error);
	}

	return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error retrieving data for the advisor');
};
