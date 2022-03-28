import type { RequestHandler } from '@sveltejs/kit';
import { AdvisorAgency, advisorAgencyFieldsFragment } from '$lib/store/advisor';
import { makeEmptyResponse } from '$lib/utils/fetch';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { salutationFieldsFragment } from '$lib/store/salutationType';
/**
 * @type {import('@sveltejs/kit').Get}
 */
export type AdvisorsGetData = {
	agency: {
		advisors: AdvisorAgency[];
	};
};
export const get: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
		const query = `
		query($id: ID!) {
            agency(id: $id){
			    advisors{
                    ...advisorAgencyFields
                }
            }
		} 
		${advisorAgencyFieldsFragment}
        ${salutationFieldsFragment}
		`;
		const res = await client.query<AdvisorsGetData>(query, { id: event.locals.user?.agencyMe?.id }).toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data?.agency?.advisors || []));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error getting advisors of agency', error);
	}

	return makeEmptyResponse(500);
};
