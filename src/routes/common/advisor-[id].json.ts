import type { RequestHandler } from '@sveltejs/kit';
import { Advisor, advisorFieldsFragment } from '$lib/store/advisor';
import { makeEmptyResponse } from '$lib/utils/fetch';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import {
	affiliatteAgencyFieldsFragment,
	affiliatteBenefitProgramFieldsFragment,
	affiliatteNetworkFieldsFragment
} from '$lib/store/affiliate';
import { experienceFieldsFragment } from '$lib/store/experience';
import { experienceTypeFieldsFragment } from '$lib/store/experienceType';
import { destinationFieldsFragment } from '$lib/store/destination';
import { countryFieldsFragment } from '$lib/store/country';
import { languageFieldsFragment } from '$lib/store/language';
import { addressFieldsFragment } from '$lib/store/address';
import { uploadFileFieldsFragment } from '$lib/store/media';
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
					...advisorFields
				}
			}
		  }	  
		${advisorFieldsFragment}
		${destinationFieldsFragment}
		${experienceFieldsFragment}
		${experienceTypeFieldsFragment}
		${countryFieldsFragment}
		${languageFieldsFragment}
		${affiliatteAgencyFieldsFragment}
		${affiliatteNetworkFieldsFragment}
		${affiliatteBenefitProgramFieldsFragment}
		${addressFieldsFragment}
		${uploadFileFieldsFragment}
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

	return makeEmptyResponse(500);
};
