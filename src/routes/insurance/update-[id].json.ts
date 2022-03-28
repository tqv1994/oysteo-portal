import type { RequestHandler } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeEmptyResponse } from '$lib/utils/fetch';
import { uploadFileFieldsFragment } from '$lib/store/upload-file';
import { Insurance, insuranceFieldsFragment } from '$lib/store/insurance';

export type updateInsuranceData = {
	updateInsurance: {
		insurance: Insurance;
	};
};

export const put: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
		const query = `mutation ($id: ID!,$insurance: editInsuranceInput){
        updateInsurance(input:{
            where: {id: $id},
            data: $insurance
            }) {
                insurance{
                    ...insuranceFields
                }
            }
        }
        ${insuranceFieldsFragment}
        ${uploadFileFieldsFragment}
    `;
		const reqBody = await event.request.json();
		const res = await client
			.mutation<updateInsuranceData>(query, { id: event.params.id || '', insurance: reqBody })
			.toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data.updateInsurance.insurance));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error update data for the insurance', error);
	}
	return makeEmptyResponse(500);
};
