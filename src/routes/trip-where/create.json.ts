import type { RequestHandler } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeErrorResponse } from '$lib/utils/fetch';
import { uploadFileFieldsFragment } from '$lib/store/upload-file';
import { TripWhere, tripWhereFieldsFragment } from '$lib/store/tripWhere';
import { countryFieldsFragment } from '$lib/store/country';

export type createTripWhereData = {
    createTripWhere: {
        tripWhere: TripWhere
    };
};

export const post: RequestHandler = async (
    event) => {
    try {
        const client = createGraphClientFromRequest(event.request);
        const query = `mutation ($tripWhere: TripWhereInput){
        createTripWhere(input:{
            data: $tripWhere
            }) {
                tripWhere{
                    ...tripWhereFields
                }
            }
        }
        ${tripWhereFieldsFragment}
        ${countryFieldsFragment}
    `;
        const reqBody = await event.request.json();
        const res = await client.mutation<createTripWhereData>(query, {tripWhere: reqBody }).toPromise();
        if (res.data) {
            return new Response(JSON.stringify(res.data.createTripWhere?.tripWhere));
        }
        if (res.error) {
            console.log(JSON.stringify(res.error, null, 2));
        }
    } catch (error) {
        console.error('Error create data for the trip where', error);
    }
    return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error creating data for the trip where');
};