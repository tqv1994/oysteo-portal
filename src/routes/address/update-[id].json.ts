import type { RequestHandler } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeEmptyResponse } from '$lib/utils/fetch';
import { countryFieldsFragment } from '$lib/store/country';
import { Address, addressFieldsFragment } from '$lib/store/address';
/**
 * @type {import('@sveltejs/kit').Post}
 */
export type updateAddressData = {
	updateAddress: {
		address: Address;
	};
};

export const put: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);

		const query = `mutation updateAddress ($id: ID!,$address: editAddressInput){
				updateAddress(input:{
					where: {id: $id},
					data: $address
					}) {
						address{
							...addressFields
						}
					}
				}
				${addressFieldsFragment}
				${countryFieldsFragment}
			`;

		if (!event.params.id) {
			return makeEmptyResponse(404);
		}

		const reqBody = await event.request.json();
		const addressData = reqBody.data;
		delete addressData.id;

		const res = await client
			.mutation<updateAddressData>(query, {
				id: event.params.id,
				address: addressData
			})
			.toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error update data for the address', error);
	}
	return makeEmptyResponse(500);
};
