import type { RequestHandler } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeEmptyResponse } from '$lib/utils/fetch';
import { Trip, tripBasicFieldsFragment, TRipInput } from '$lib/store/trip';
import { queryURLParamToJSON } from '$lib/helpers/utils';
import { currencyFieldsFragment } from '$lib/store/currency';

type TripQueryResult = {
	trips: Trip[];
};

/**
 * @type {import('@sveltejs/kit').Get}
 */
export const get: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
		const query = `query ($where: JSON) {
      trips(where:$where){
        ...tripFields
      }
    }
    ${tripBasicFieldsFragment}
    ${currencyFieldsFragment}
    `;
		const params = queryURLParamToJSON(event.url.searchParams.toString());
		const where: TRipInput = new TRipInput({ ...params });
		const res = await client.query<TripQueryResult>(query, { where }).toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data.trips || []));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error getting trips', error);
	}
	return makeEmptyResponse(500);
};
