import type { RequestHandler } from '@sveltejs/kit';
import { makeEmptyResponse } from '$lib/utils/fetch';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { paymentFieldsFragment } from '$lib/store/payment';
import { salutationFieldsFragment } from '$lib/store/salutationType';
import { paymentMethodFieldsFragment } from '$lib/store/paymentMethod';

/**
 * @type {import('@sveltejs/kit').Put}
 */

export type assignPaymentData = {
	updateAgency: {
		agency: {
			payments: string[];
		};
	};
};
export const put: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
		const reqBody = await event.request.json();
		const payments = [reqBody.data];
		const query = `
        mutation updateAgency($id: ID!, $payments: [ID]){
            updateAgency(input: { 
              where : {id : $id },
              data: {payments: $payments}
          }) 
            {
              agency {
                payments{
					...paymentFields
                }
              }
            }
          }	
		${paymentFieldsFragment}
		${paymentMethodFieldsFragment}
		${salutationFieldsFragment}  
         `;

		const res = await client
			.mutation<assignPaymentData>(query, {
				id: event.params.id,
				payments: payments
			})
			.toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error assign bill payment', error);
	}

	return makeEmptyResponse(500);
};
