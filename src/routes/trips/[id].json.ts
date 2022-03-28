import type { RequestHandler } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeEmptyResponse } from '$lib/utils/fetch';
import { uploadFileFieldsFragment } from '$lib/store/upload-file';
import { subTravellerFieldsFragment, travellerFieldsFragment } from '$lib/store/traveller';
import { visaFieldsFragment } from '$lib/store/visa';
import { identificationFieldsFragment } from '$lib/store/identification';
import { salutationFieldsFragment } from '$lib/store/salutationType';
import { countryFieldsFragment } from '$lib/store/country';
import { Trip, tripFieldsFragment } from '$lib/store/trip';
import { destinationFieldsFragment } from '$lib/store/destination';
import { docmentFieldsFragment } from '$lib/store/document';
import { insuranceFieldsFragment } from '$lib/store/insurance';
import { interestFieldsFragment } from '$lib/store/interest';
import { addressFieldsFragment } from '$lib/store/address';
import {
	personalPreferenceFieldsFragment,
	travelPreferenceFieldsFragment
} from '$lib/store/preference';
import { emergencyFieldsFragments } from '$lib/store/emergency';

type TripQueryResult = {
	trips: Trip[];
};

/**
 * @type {import('@sveltejs/kit').Get}
 */
export const get: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
		const query = `query {
      trips(where:{advisors : ${event.params.id}}){
        ...tripFields
      }
    }
    ${emergencyFieldsFragments}
    ${tripFieldsFragment}
    ${destinationFieldsFragment}
    ${uploadFileFieldsFragment}
    ${travellerFieldsFragment}
    ${docmentFieldsFragment}
    ${insuranceFieldsFragment}
    ${visaFieldsFragment}
    ${salutationFieldsFragment}
    ${identificationFieldsFragment}
    ${countryFieldsFragment}
    ${subTravellerFieldsFragment}
    ${interestFieldsFragment}
    ${travelPreferenceFieldsFragment}
    ${personalPreferenceFieldsFragment}
    ${addressFieldsFragment}
    ${emergencyFieldsFragments}
    `;
		const res = await client.query<TripQueryResult>(query, event.params).toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error getting destinations', error);
	}
	return makeEmptyResponse(
		500,
		'INTERNAL_SERVER_ERROR',
		'Error retrieving data for the destinations'
	);
};
