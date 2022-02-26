import type { RequestHandler } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeErrorResponse } from '$lib/utils/fetch';
import { uploadFileFieldsFragment } from '$lib/store/upload-file';
import { Insurance, insuranceFieldsFragment } from '$lib/store/insurance';
import { Emergency, emergencyFieldsFragments } from '$lib/store/emergency';
import { countryFieldsFragment } from '$lib/store/country';

export type updateEmergencyData = {
    updateEmergency: {
        emergency: Emergency
    };
};

export const put: RequestHandler = async (
    event) => {
    try {
        const client = createGraphClientFromRequest(event.request);
        const query = `mutation ($id: ID!,$emergency: editEmergencyInput){
        updateEmergency(input:{
            where: {id: $id},
            data: $emergency
            }) {
                emergency{
                    ...emergencyFields
                }
            }
        }
        ${countryFieldsFragment}
        ${emergencyFieldsFragments}
        ${uploadFileFieldsFragment}
    `;
        const reqBody = await event.request.json();
        const res = await client.mutation<updateEmergencyData>(query, {id:event.params.id || '' , emergency: reqBody }).toPromise();
        if (res.data) {
            return new Response(JSON.stringify(res.data.updateEmergency.emergency));
        }
        if (res.error) {
            console.log(JSON.stringify(res.error, null, 2));
        }
    } catch (error) {
        console.error('Error update data for the emergency', error);
    }
    return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error updating data for the emergency');
};