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
import type { User } from '$lib/store/auth';

const query = `
    query($id: ID!) {
        users(where:{myAdvisors: [$id]}) {
            id
            travellerMe{
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
/**
 * @type {import('@sveltejs/kit').Get}
 */
export const get: RequestHandler = async (request: Request) => {
  try {
    const client = createGraphClientFromRequest(request);
    const res = await client.query<{users: User[]}>(query, {id: request.locals.user?.advisorMe?.id}).toPromise();
    if (res.data?.users) {
        const result: Traveller[] = res.data.users.reduce((acc: Traveller[] ,item: User)=>{
            if(item.travellerMe){
                acc.push(item.travellerMe);
            }
            return acc;
        },[])
      return {
        body: JSON.stringify(result),
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
