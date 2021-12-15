import type { RequestHandler, Request } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeErrorResponse } from '$lib/utils/fetch';
import type { Rec } from '@sveltejs/kit/types/helper';
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
export const put: RequestHandler = async (request: Request<Rec<any>, AuthForm>) => {
	try {
		const client = createGraphClientFromRequest(request);
		const type = request.params.type;
		if (!type) {
			return makeErrorResponse(404, 'NOT_FOUND', 'Error not found address');
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

		if (!request.params.id) {
			return makeErrorResponse(404, 'NOT_FOUND', 'Error not found address');
		}

		const res = await client
			.mutation<updateAdvisorAddressData | updateAgencyAddressData>(query, {
				id: request.params.id,
				updateData: [request.body.data]
			})
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
		console.error('Error update data for the address', error);
	}
	return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error updating data for the address');
};
