import type { RequestHandler } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeEmptyResponse } from '$lib/utils/fetch';
import { countryFieldsFragment } from '$lib/store/country';
import { Address, addressFieldsFragment } from '$lib/store/address';
/**
 * @type {import('@sveltejs/kit').Put}
 */
export type updateAdvisorAddressData = {
	updateAdvisor: {
		address: Address[];
	};
};

export type updateAgencyAddressData = {
	updateAgency: {
		addresses: Address[];
	};
};
export const put: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
		const type = event.params.type;
		if (!type) {
			return makeEmptyResponse(404);
		}

		let query = ``;
		if (type == 'advisor') {
			query = `
				mutation updateAdvisor($id: ID!,$updateData: [ID]){
				updateAdvisor(input: { 
					where : {id : $id },
					data: {address: $updateData}
				}) 
				{
					advisor {
						address{
							...addressFields
						}
					}
				}
				}	
				${addressFieldsFragment}  
				${countryFieldsFragment}
			`;
		} else if (type == 'agency') {
			query = `
				mutation updateAgency($id: ID!,$updateData: [ID]){
				updateAgency(input: { 
					where : {id : $id },
					data: {addresses: $updateData}
				}) 
				{
					agency {
						addresses{
							...addressFields
						}
					}
				}
				}	
				${addressFieldsFragment}  
				${countryFieldsFragment}
			`;
		}

		if (!event.params.id) {
			return makeEmptyResponse(404);
		}

		const reqBody = await event.request.json();

		const res = await client
			.mutation<updateAdvisorAddressData | updateAgencyAddressData>(query, {
				id: event.params.id,
				updateData: [reqBody.data]
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
