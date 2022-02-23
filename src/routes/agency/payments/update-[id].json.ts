import type { RequestHandler } from '@sveltejs/kit';
import { makeErrorResponse } from '$lib/utils/fetch';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { AdvisorAgency, advisorAgencyFieldsFragment } from '$lib/store/advisor';
import { salutationFieldsFragment } from '$lib/store/salutationType';
import { Payment, paymentFieldsFragment, paymentMethodFieldsFragment } from '$lib/store/payment';
/**
 * @type {import('@sveltejs/kit').Put}
 */

export type updatePaymentData = {
	updateBillPayment: {
		billPayment: Payment[];
	};
};
export const put: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
    const reqBody = await event.request.json();
		const updateData = reqBody.data;
		delete updateData.id;

		const query = `
			mutation updateBillPayment($id: ID!, $updateData: editBillPaymentInput ){
				updateBillPayment(input:{
					where: {id: $id},
					data: $updateData
                }) 
				{
                    billPayment {
                        ...paymentFields
                    }
				}
			}	  
			${paymentFieldsFragment}
            ${paymentMethodFieldsFragment}
            ${salutationFieldsFragment}
		`;
		const res = await client
			.mutation<updatePaymentData>(query, { id: event.params.id, updateData: updateData })
			.toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error updating bill payment', error);
	}

	return makeErrorResponse(
		500,
		'INTERNAL_SERVER_ERROR',
		'Error retrieving data for the bill payment'
	);
};
