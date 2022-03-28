import type { RequestHandler } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeEmptyResponse } from '$lib/utils/fetch';
import { uploadFileFieldsFragment } from '$lib/store/upload-file';
import { subTravellerFieldsFragment, travellerFieldsFragment } from '$lib/store/traveller';
import { visaFieldsFragment } from '$lib/store/visa';
import { salutationFieldsFragment } from '$lib/store/salutationType';
import { identificationFieldsFragment } from '$lib/store/identification';
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
import { tripWhereFieldsFragment } from '$lib/store/tripWhere';
import { experienceFieldsFragment } from '$lib/store/experience';
import { experienceTypeFieldsFragment } from '$lib/store/experienceType';
import { lodgingTypeFieldsFragment } from '$lib/store/lodgingType';
import { roomStyleFieldsFragment, roomStyleTypeFieldsFragment } from '$lib/store/roomStyle';
import { roomPreferenceFieldsFragment } from '$lib/store/roomPreference';
import { currencyFieldsFragment } from '$lib/store/currency';
import { travelingWithYouFieldsFragment } from '$lib/store/travelingWithYou';
import { destinationTypeFieldsFragment } from '$lib/store/destinationType';
import { emergencyFieldsFragments } from '$lib/store/emergency';

export type updateTripData = {
	updateTrip: {
		trip: Trip;
	};
};

export const put: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
		const query = `mutation ($id: ID!,$trip: editTripInput){
        updateTrip(input:{
            where: {id: $id},
            data: $trip
            }) {
                trip{
                    ...tripFields
                }
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
        ${subTravellerFieldsFragment}
        ${interestFieldsFragment}
        ${travelPreferenceFieldsFragment}
        ${personalPreferenceFieldsFragment}
        ${addressFieldsFragment}
        ${tripWhereFieldsFragment}
        ${countryFieldsFragment}
        ${experienceFieldsFragment}
        ${lodgingTypeFieldsFragment}
        ${roomStyleFieldsFragment}
        ${roomStyleTypeFieldsFragment}
        ${roomPreferenceFieldsFragment}
        ${currencyFieldsFragment}
        ${travelingWithYouFieldsFragment}
        ${destinationTypeFieldsFragment}
    `;
		const reqBody = await event.request.json();
		const res = await client
			.mutation<updateTripData>(query, { id: event.params.id || '', trip: reqBody })
			.toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data.updateTrip?.trip));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error update data for the trip', error);
	}
	return makeEmptyResponse(500);
};
