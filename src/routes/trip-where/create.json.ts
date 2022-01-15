import type { RequestHandler, Request } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeErrorResponse } from '$lib/utils/fetch';
import { uploadFileFieldsFragment } from '$lib/store/upload-file';
import type { Rec } from '@sveltejs/kit/types/helper';
import { TripWhere, tripWhereFieldsFragment } from '$lib/store/tripWhere';
import { countryFieldsFragment } from '$lib/store/country';

export type createTripWhereData = {
    createTripWhere: {
        tripWhere: TripWhere
    };
};

export const post: RequestHandler = async (
    request: Request<Rec<any>, AuthForm>) => {
    try {
        const client = createGraphClientFromRequest(request);
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
        const res = await client.mutation<createTripWhereData>(query, {tripWhere: request.body }).toPromise();
        if (res.data) {
            return {
                body: JSON.stringify(res.data.createTripWhere?.tripWhere),
            };
        }
        if (res.error) {
            console.log(JSON.stringify(res.error, null, 2));
        }
    } catch (error) {
        console.error('Error create data for the trip where', error);
    }
    return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error creating data for the trip where');
};