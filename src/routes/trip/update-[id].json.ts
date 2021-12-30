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

export type updateTripData = {
    updateTrip: {
        trip: Trip
    };
};

export const put: RequestHandler = async (
    request: Request<Rec<any>, AuthForm>) => {
    try {
        const client = createGraphClientFromRequest(request);
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
    `;
        const res = await client.mutation<updateTripData>(query, {id:request.params.id || '' , trip: request.body }).toPromise();
        if (res.data) {
            return {
                body: JSON.stringify(res.data.updateTrip.trip),
            };
        }
        if (res.error) {
            console.log(JSON.stringify(res.error, null, 2));
        }
    } catch (error) {
        console.error('Error update data for the trip', error);
    }
    return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error updating data for the trip');
};