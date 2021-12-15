import type { Advisor } from '$lib/store/advisor';
import { makeErrorResponse } from '$lib/utils/fetch';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import type { RequestHandler, Request } from '@sveltejs/kit';
import type { Rec } from '@sveltejs/kit/types/helper';

export type createAdvisorData = {
	createAdvisor: {
		advisor: Advisor;
	};
};
/**
 * @type {import('@sveltejs/kit').Post}
 */
export const post: RequestHandler = async (request: Request<Rec<any>, AuthForm>) => {
	try {
		const client = createGraphClientFromRequest(request);
		const query = `
		mutation createAdvisor ($advisor: AdvisorInput){
            createAdvisor(input:{data: $advisor}){
            advisor{
                id
              }    
            }
          }
		`;
		const res = await client
			.mutation<createAdvisorData>(query, { advisor: request.body })
			.toPromise();
		if (res.data) {
			return {
				body: JSON.stringify(res.data.createAdvisor.advisor)
			};
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error creating advisor', error);
	}

	return makeErrorResponse(500, 'INTERNAL_SERVER_ERROR', 'Error retrieving data for the advisor');
};
