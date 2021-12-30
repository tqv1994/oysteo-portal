import type { RequestHandler, Request } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeErrorResponse } from '$lib/utils/fetch';
import { uploadFileFieldsFragment } from '$lib/store/upload-file';
import { countryFieldsFragment } from '$lib/store/country';
import { subTravellerFieldsFragment, Traveller, travellerFieldsFragment } from '$lib/store/traveller';
import { visaFieldsFragment } from '$lib/store/visa';
import { salutationFieldsFragment } from '$lib/store/salutationType';
import { identificationFieldsFragment } from '$lib/store/identification';
import { addressFieldsFragment } from '$lib/store/address';
import { interestFieldsFragment } from '$lib/store/interest';
import { personalPreferenceFieldsFragment, travelPreferenceFieldsFragment } from '$lib/store/preference';

const query = `
    query($id: ID!) {
        traveller(id: $id) {
            ...travellerFields
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
/**
 * @type {import('@sveltejs/kit').Get}
 */
export const get: RequestHandler = async (request: Request) => {
  try {
    const client = createGraphClientFromRequest(request);
    const res = await client.query<{traveller: Traveller}>(query, request.params).toPromise();
    if (res.data?.traveller) {
      return {
        body: JSON.stringify(res.data.traveller),
      };
    }
    if (res.error) {
      console.error('Query rejected by server', request.params, query, JSON.stringify(res.error, null, 2));
    }
  } catch (error) {
    console.error('Error getting traveler', error);
  }
  return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error retrieving data for the traveler');
};
