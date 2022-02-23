import type { RequestHandler } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeErrorResponse } from '$lib/utils/fetch';
/**
 * @type {import('@sveltejs/kit').Post}
 */
export type deleteDocumentData = {
    deleteDocument: {
        document: Document
    };
};

export const del: RequestHandler = async (event) => {
    try {
        const client = createGraphClientFromRequest(event.request);
        const query = `mutation deleteDocument ($id: ID!){
        deleteDocument(input:{
            where: {id: $id},
            }) {
                document{
                    id
                }
            }
        }
    `;
        const res = await client.mutation<deleteDocumentData>(query, {id:event.params.id || '' }).toPromise();
        if (res.data) {
            return new Response(JSON.stringify(res.data.deleteDocument?.document));
        }
        if (res.error) {
            console.log(JSON.stringify(res.error, null, 2));
        }
    } catch (error) {
        console.error('Error delete data for the document', error);
    }
    return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error deleting data for the document');
};