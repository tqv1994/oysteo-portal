import type { RequestHandler } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeEmptyResponse } from '$lib/utils/fetch';
import { uploadFileFieldsFragment } from '$lib/store/upload-file';
import { Emergency, emergencyFieldsFragments } from '$lib/store/emergency';
import { countryFieldsFragment } from '$lib/store/country';

export type createEmergencyData = {
	createEmergency: {
		emergency: Emergency;
	};
};

export const post: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
		const query = `mutation ($emergency: EmergencyInput){
        createEmergency(input:{
            data: $emergency
            }) {
                emergency{
                    ...emergencyFields
                }
            }
        }
        ${uploadFileFieldsFragment}
        ${countryFieldsFragment}
        ${emergencyFieldsFragments}
    `;
		const reqBody = await event.request.json();
		const res = await client
			.mutation<createEmergencyData>(query, { emergency: reqBody })
			.toPromise();

		if (res.data) {
			return new Response(JSON.stringify(res.data.createEmergency?.emergency));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error create data for the emergency', error);
	}
	return makeEmptyResponse(500);
};
