import type { RequestHandler } from '@sveltejs/kit';
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
import type { User } from '$lib/store/auth';

const query = `
    query($id: ID!) {
        users(limit: 1, where: {travellerMe: $id}){
          id
          myAdvisors{
            id,
            name
          }
          travellerMe{
            ...travellerFields
          }
          productLikes{
            id
            name
          }
          experienceLikes{
            id
            name
          }
          destinationLikes{
            id
            name
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
/**
 * @type {import('@sveltejs/kit').Get}
 */
export const get: RequestHandler = async (event) => {
  try {
    const client = createGraphClientFromRequest(event.request);
    const res = await client.query<{users: User[]}>(query, event.params).toPromise();
    if (res.data?.users && res.data?.users.length > 0) {
      return new Response(JSON.stringify(res.data.users[0]));
    }
    if (res.error) {
      console.error('Query rejected by server', event.params, query, JSON.stringify(res.error, null, 2));
    }
  } catch (error) {
    console.error('Error getting traveler', error);
  }
  return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error retrieving data for the traveler');
};
