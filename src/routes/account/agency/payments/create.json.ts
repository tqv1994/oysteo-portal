import type { RequestHandler } from '@sveltejs/kit';
import { makeEmptyResponse } from '$lib/utils/fetch';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import type { Payment } from '$lib/store/payment';
/**
 * @type {import('@sveltejs/kit').Post}
 */
export type createPaymentData = {
	createBillPayment: {
		billPayment: Payment;
	};
};

export const post: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
		const query = `
		mutation createBillPayment ($payment: BillPaymentInput ){
            createBillPayment(input:{data: $payment}){
                billPayment{
                    id
                }    
            }
        }
		`;
		const reqBody = await event.request.json();
		const res = await client.mutation<createPaymentData>(query, { payment: reqBody }).toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error creating bill payment', error);
	}

	return makeEmptyResponse(
		500,
		'INTERNAL_SERVER_ERROR',
		'Error retrieving data for the bill payment'
	);
};
