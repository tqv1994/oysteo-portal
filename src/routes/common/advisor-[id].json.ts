import type { RequestHandler, Request } from '@sveltejs/kit';
import type { Advisor } from '$lib/store/advisor';
import { makeErrorResponse } from '$lib/utils/fetch';
import type { Rec } from '@sveltejs/kit/types/helper';
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
export const put: RequestHandler = async (request: Request<Rec<any>, AuthForm>) => {
	try {
		const client = createGraphClientFromRequest(request);
		const body = request.body;

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
		const res = await client
			.mutation<Advisor>(query, { id: request.params.id, updateData: body })
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
		console.error('Error updating advisor', error);
	}

	return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error retrieving data for the advisor');
};
