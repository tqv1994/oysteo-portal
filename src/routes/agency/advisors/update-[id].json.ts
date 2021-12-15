import type { RequestHandler, Request } from '@sveltejs/kit';
import { makeErrorResponse } from '$lib/utils/fetch';
import type { Rec } from '@sveltejs/kit/types/helper';
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
export const put: RequestHandler = async (request: Request<Rec<any>, AuthForm>) => {
	try {
		const client = createGraphClientFromRequest(request);
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
		const res = await client
			.mutation<updateAdvisorAgencyData>(query, { id: request.params.id, updateData: request.body })
			.toPromise();
		if (res.data) {
			return {
				body: JSON.stringify(res.data)
			};
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error updating advisor of agency', error);
	}

	return makeErrorResponse(
		500,
		'INTERNAL_SERVER_ERROR',
		'Error retrieving data for the advisor of agency'
	);
};
