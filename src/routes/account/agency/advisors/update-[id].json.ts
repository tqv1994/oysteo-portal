import type { RequestHandler } from '@sveltejs/kit';
import { makeEmptyResponse } from '$lib/utils/fetch';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { AdvisorAgency, advisorAgencyFieldsFragment } from '$lib/store/advisor';
import { salutationFieldsFragment } from '$lib/store/salutationType';
/**
 * @type {import('@sveltejs/kit').Put}
 */

export type updateAdvisorAgencyData = {
	updateAdvisor: {
		advisor: AdvisorAgency;
	};
};
export const put: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
		const query = `
			mutation updateAdvisor($id: ID!, $updateData: editAdvisorInput ){
				updateAdvisor(input:{
					where: {id: $id},
					data: $updateData
                }) 
				{
                    advisor {
                        ...advisorAgencyFields
                    }
				}
			}	  
			${advisorAgencyFieldsFragment}
            ${salutationFieldsFragment}
		`;
		const reqBody = await event.request.json();
		const res = await client
			.mutation<updateAdvisorAgencyData>(query, { id: event.params.id, updateData: reqBody })
			.toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error updating advisor of agency', error);
	}

	return makeEmptyResponse(
		500,
		'INTERNAL_SERVER_ERROR',
		'Error retrieving data for the advisor of agency'
	);
};
