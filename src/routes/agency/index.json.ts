import type { RequestHandler } from '@sveltejs/kit';
import { Agency, agencyFieldsFragment } from '$lib/store/agency';
import { makeErrorResponse } from '$lib/utils/fetch';
import { countryFieldsFragment } from '$lib/store/country';
import {
	affiliatteAgencyFieldsFragment,
	affiliatteNetworkFieldsFragment,
	affiliatteBenefitProgramFieldsFragment
} from '$lib/store/affiliate';
import { salutationFieldsFragment } from '$lib/store/salutationType';
import { addressFieldsFragment } from '$lib/store/address';
import { advisorAgencyFieldsFragment } from '$lib/store/advisor';
import { uploadFileFieldsFragment } from '$lib/store/media';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { paymentFieldsFragment, paymentMethodFieldsFragment } from '$lib/store/payment';
/**
 * @type {import('@sveltejs/kit').Get}
 */
export type AgencyGetData = {
	me: {
		agencyMe: Agency;
	};
};
export const get: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
		const query = `query {
			me {
			  agencyMe {
				...agencyFields
			  }
			}
		  } 
		  ${agencyFieldsFragment}
		  ${countryFieldsFragment}
		  ${affiliatteNetworkFieldsFragment}
		  ${affiliatteAgencyFieldsFragment}
		  ${affiliatteBenefitProgramFieldsFragment}
		  ${addressFieldsFragment}
		  ${advisorAgencyFieldsFragment}
		  ${uploadFileFieldsFragment}
		  ${salutationFieldsFragment}
		  ${paymentFieldsFragment}
		  ${paymentMethodFieldsFragment}
		  `;
		const res = await client.query<AgencyGetData>(query).toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error getting agency', error);
	}

	return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error retrieving data for the agency');
};
