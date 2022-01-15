import type { RequestHandler, Request } from '@sveltejs/kit';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import { makeErrorResponse } from '$lib/utils/fetch';
import { uploadFileFieldsFragment } from '$lib/store/upload-file';
import { docmentFieldsFragment } from '$lib/store/document';
import type { Rec } from '@sveltejs/kit/types/helper';

export type createDocumentData = {
    createDocument: {
        document: Document
    };
};

export const post: RequestHandler = async (
    request: Request<Rec<any>, AuthForm>) => {
    try {
        const client = createGraphClientFromRequest(request);
        const query = `mutation ($document: DocumentInput){
        createDocument(input:{
            data: $document
            }) {
                document{
                    ...documentFields
                }
            }
        }
        ${docmentFieldsFragment}
        ${uploadFileFieldsFragment}
    `;
        const res = await client.mutation<createDocumentData>(query, {document: request.body }).toPromise();
        if (res.data) {
            return {
                body: JSON.stringify(res.data.createDocument?.document),
            };
        }
        if (res.error) {
            console.log(JSON.stringify(res.error, null, 2));
        }
    } catch (error) {
        console.error('Error create data for the document', error);
    }
    return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error creating data for the document');
};