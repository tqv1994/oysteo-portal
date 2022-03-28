import type { RequestHandler } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeEmptyResponse } from '$lib/utils/fetch';
import { uploadFileFieldsFragment } from '$lib/store/upload-file';
import { Insurance, insuranceFieldsFragment } from '$lib/store/insurance';

export type createInsuranceData = {
	createInsurance: {
		insurance: Insurance;
	};
};

export const post: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
		const query = `mutation ($insurance: InsuranceInput){
        createInsurance(input:{
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
			.mutation<createInsuranceData>(query, { insurance: reqBody })
			.toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data.createInsurance?.insurance));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error create data for the insurance', error);
	}
	return makeEmptyResponse(500);
};
