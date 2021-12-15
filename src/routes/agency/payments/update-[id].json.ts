import type { RequestHandler, Request } from '@sveltejs/kit';
import { makeErrorResponse } from '$lib/utils/fetch';
import type { Rec } from '@sveltejs/kit/types/helper';
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
export const put: RequestHandler = async (request: Request<Rec<any>, AuthForm>) => {
	try {
		const client = createGraphClientFromRequest(request);
		const updateData = request.body.data;
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
			.mutation<updatePaymentData>(query, { id: request.params.id, updateData: updateData })
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
		console.error('Error updating bill payment', error);
	}

	return makeErrorResponse(
		500,
		'INTERNAL_SERVER_ERROR',
		'Error retrieving data for the bill payment'
	);
};
