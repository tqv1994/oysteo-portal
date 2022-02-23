import type { RequestHandler } from '@sveltejs/kit';
import { Advisor, advisorFieldsFragment } from '$lib/store/advisor';
import { makeErrorResponse } from '$lib/utils/fetch';
import { destinationFieldsFragment } from '$lib/store/destination';
import { experienceFieldsFragment } from '$lib/store/experience';
import { countryFieldsFragment } from '$lib/store/country';
import { languageFieldsFragment } from '$lib/store/language';
import {
	affiliatteAgencyFieldsFragment,
	affiliatteBenefitProgramFieldsFragment,
	affiliatteNetworkFieldsFragment
} from '$lib/store/affiliate';
import { addressFieldsFragment } from '$lib/store/address';
import { uploadFileFieldsFragment } from '$lib/store/media';
import { createGraphClientFromRequest } from '$lib/utils/graph';
/**
 * @type {import('@sveltejs/kit').Get}
 */
export type AdvisorGetData = {
	me: {
		advisorMe: Advisor;
	};
};
export const get: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
		const query = `
		query {
			me {
			  advisorMe {
				...advisorFields
			  }
			}
		  } 
		${advisorFieldsFragment}
		${destinationFieldsFragment}
		${experienceFieldsFragment}
		${countryFieldsFragment}
		${languageFieldsFragment}
		${affiliatteAgencyFieldsFragment}
		${affiliatteNetworkFieldsFragment}
		${affiliatteBenefitProgramFieldsFragment}
		${addressFieldsFragment}
		${uploadFileFieldsFragment}
		`;
		const res = await client.query<AdvisorGetData>(query).toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error getting advisor', error);
	}

	return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error retrieving data for the advisor');
};
