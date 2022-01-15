import type { RequestHandler, Request } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeErrorResponse } from '$lib/utils/fetch';
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
import { personalPreferenceFieldsFragment, travelPreferenceFieldsFragment } from '$lib/store/preference';
import type { Rec } from '@sveltejs/kit/types/helper';
import { tripWhereFieldsFragment } from '$lib/store/tripWhere';
import { experienceFieldsFragment } from '$lib/store/experience';
import { experienceTypeFieldsFragment } from '$lib/store/experienceType';
import { lodgingTypeFieldsFragment } from '$lib/store/lodgingType';
import { roomStyleFieldsFragment, roomStyleTypeFieldsFragment } from '$lib/store/roomStyle';
import { roomPreferenceFieldsFragment } from '$lib/store/roomPreference';
import { currencyFieldsFragment } from '$lib/store/currency';
import { travelingWithYouFieldsFragment } from '$lib/store/travelingWithYou';
import { destinationTypeFieldsFragment } from '$lib/store/destinationType';

export type createTripData = {
    createTrip: {
        trip: Trip
    };
};

export const post: RequestHandler = async (
    request: Request<Rec<any>, AuthForm>) => {
    try {
        const client = createGraphClientFromRequest(request);
        const query = `mutation ($trip: TripInput){
        createTrip(input:{
            data: $trip
            }) {
                trip{
                    ...tripFields
                }
            }
        }
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
        ${tripWhereFieldsFragment}
        ${experienceFieldsFragment}
        ${experienceTypeFieldsFragment}
        ${lodgingTypeFieldsFragment}
        ${roomStyleFieldsFragment}
        ${roomStyleTypeFieldsFragment}
        ${roomPreferenceFieldsFragment}
        ${currencyFieldsFragment}
        ${travelingWithYouFieldsFragment}
        ${destinationTypeFieldsFragment}
    `;
        const res = await client.mutation<createTripData>(query, {trip: {...request.body, advisor: request.locals.user?.advisorMe?.id} }).toPromise();
        if (res.data) {
            return {
                body: JSON.stringify(res.data.createTrip.trip),
            };
        }
        if (res.error) {
            console.log(JSON.stringify(res.error, null, 2));
        }
    } catch (error) {
        console.error('Error create data for the trip', error);
    }
    return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error creating data for the trip');
};