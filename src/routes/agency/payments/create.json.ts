import type { RequestHandler, Request } from '@sveltejs/kit';
import { makeErrorResponse } from '$lib/utils/fetch';
import type { Rec } from '@sveltejs/kit/types/helper';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { salutationFieldsFragment } from '$lib/store/salutationType';
import type { Payment } from '$lib/store/payment';
/**
 * @type {import('@sveltejs/kit').Post}
 */
export type createPaymentData = {
	createBillPayment: {
		billPayment: Payment;
	};
};

export const post: RequestHandler = async (request: Request<Rec<any>, AuthForm>) => {
	try {
		const client = createGraphClientFromRequest(request);
		const query = `
		mutation createBillPayment ($payment: BillPaymentInput ){
            createBillPayment(input:{data: $payment}){
                billPayment{
                    id
                }    
            }
        }
		`;
		const res = await client
			.mutation<createPaymentData>(query, { payment: request.body })
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
		console.error('Error creating bill payment', error);
	}

	return makeErrorResponse(
		500,
		'INTERNAL_SERVER_ERROR',
		'Error retrieving data for the bill payment'
	);
};
