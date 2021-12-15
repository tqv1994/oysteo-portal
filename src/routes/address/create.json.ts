import type { RequestHandler, Request } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeErrorResponse } from '$lib/utils/fetch';
import type { Rec } from '@sveltejs/kit/types/helper';
import { Address, addressFieldsFragment } from '$lib/store/address';
import { countryFieldsFragment } from '$lib/store/country';
/**
 * @type {import('@sveltejs/kit').Post}
 */
export type createAddressData = {
	createAddress: {
		address: Address;
	};
};

export const post: RequestHandler = async (request: Request<Rec<any>, AuthForm>) => {
	try {
		const client = createGraphClientFromRequest(request);
		const query = `mutation createAddress ($address: AddressInput){
        createAddress(input:{
          data: $address
        }) {
            address{
                id
            }
        }
      }
    `;
		const res = await client
			.mutation<createAddressData>(query, { address: request.body })
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
		console.error('Error create data for the address', error);
	}
	return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error creating data for the address');
};
