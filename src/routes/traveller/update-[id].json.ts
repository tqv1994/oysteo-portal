import type { RequestHandler } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeErrorResponse } from '$lib/utils/fetch';
import {
	subTravellerFieldsFragment,
	Traveller,
	travellerFieldsFragment
} from '$lib/store/traveller';
import { uploadFileFieldsFragment } from '$lib/store/upload-file';
import { visaFieldsFragment } from '$lib/store/visa';
import { salutationFieldsFragment } from '$lib/store/salutationType';
import { identificationFieldsFragment } from '$lib/store/identification';
import { countryFieldsFragment } from '$lib/store/country';
import { addressFieldsFragment } from '$lib/store/address';
import {
	personalPreferenceFieldsFragment,
	travelPreferenceFieldsFragment
} from '$lib/store/preference';
import { interestFieldsFragment } from '$lib/store/interest';
/**
 * @type {import('@sveltejs/kit').Post}
 */
export type updateTravellerData = {
	updateTraveller: {
		traveller: Traveller;
	};
};

export const put: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
		const query = `mutation updateTraveller ($id: ID!,$traveller: editTravellerInput){
        updateTraveller(input:{
            where: {id: $id},
            data: $traveller
            }) {
                traveller{
                    ...travellerFields
                }
            }
        }
        ${uploadFileFieldsFragment}
        ${travellerFieldsFragment}
        ${visaFieldsFragment}
        ${salutationFieldsFragment}
        ${identificationFieldsFragment}
        ${countryFieldsFragment}
        ${subTravellerFieldsFragment}
        ${addressFieldsFragment}
        ${interestFieldsFragment}
        ${travelPreferenceFieldsFragment}
        ${personalPreferenceFieldsFragment}
    `;
		const reqBody = await event.request.json();
		const res = await client
			.mutation<updateTravellerData>(query, {
				id: request.params.id || '',
				traveller: reqBody
			})
			.toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data.updateTraveller?.traveller));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error update data for the traveller', error);
	}
	return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error updating data for the traveller');
};
