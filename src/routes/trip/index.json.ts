import type { RequestHandler, Request } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeErrorResponse } from '$lib/utils/fetch';
import { uploadFileFieldsFragment } from '$lib/store/upload-file';
import { subTravellerFieldsFragment, travellerFieldsFragment } from '$lib/store/traveller';
import { visaFieldsFragment } from '$lib/store/visa';
import { salutationFieldsFragment } from '$lib/store/salutationType';
import { identificationFieldsFragment } from '$lib/store/identification';
import { countryFieldsFragment } from '$lib/store/country';
import { Trip, tripBasicFieldsFragment, tripFieldsFragment, TRipInput } from '$lib/store/trip';
import { destinationFieldsFragment } from '$lib/store/destination';
import { docmentFieldsFragment } from '$lib/store/document';
import { insuranceFieldsFragment } from '$lib/store/insurance';
import { interestFieldsFragment } from '$lib/store/interest';
import { addressFieldsFragment } from '$lib/store/address';
import { personalPreferenceFieldsFragment, travelPreferenceFieldsFragment } from '$lib/store/preference';
import { queryURLParamToJSON } from '$lib/helpers/utils';
import { tripWhereFieldsFragment } from '$lib/store/tripWhere';
import { experienceFieldsFragment } from '$lib/store/experience';
import { lodgingTypeFieldsFragment } from '$lib/store/lodgingType';
import { roomStyleFieldsFragment, roomStyleTypeFieldsFragment } from '$lib/store/roomStyle';
import { roomPreferenceFieldsFragment } from '$lib/store/roomPreference';
import { currencyFieldsFragment } from '$lib/store/currency';
import { travelingWithYouFieldsFragment } from '$lib/store/travelingWithYou';
import { experienceTypeFieldsFragment } from '$lib/store/experienceType';
import { destinationTypeFieldsFragment } from '$lib/store/destinationType';

type TripQueryResult = {
  trips: Trip[];
}


/**
 * @type {import('@sveltejs/kit').Get}
 */
export const get: RequestHandler = async (request: Request) => {
  try {
    const client = createGraphClientFromRequest(request);
    const query = `query ($where: JSON) {
      trips(where:$where){
        ...tripFields
      }
    }
    ${tripBasicFieldsFragment}
    ${currencyFieldsFragment}
    `;
    const params = queryURLParamToJSON(request.url.searchParams.toString());
    console.log(params);
    const where: TRipInput = new TRipInput({ ...params });
    const res = await client.query<TripQueryResult>(query, { where }).toPromise();
    if (res.data) {
      return {
        body: JSON.stringify(res.data.trips || []),
      };
    }
    if (res.error) {
      console.log(JSON.stringify(res.error, null, 2));
    }
  } catch (error) {
    console.error('Error getting trips', error);
  }
  return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error retrieving data for the trips');
};
