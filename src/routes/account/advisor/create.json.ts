import type { Advisor } from '$lib/store/advisor';
import { makeEmptyResponse } from '$lib/utils/fetch';
import { createGraphClientFromRequest } from '$lib/utils/graph';
import type { RequestHandler } from '@sveltejs/kit';

export type createAdvisorData = {
	createAdvisor: {
		advisor: Advisor;
	};
};
/**
 * @type {import('@sveltejs/kit').Post}
 */
export const post: RequestHandler = async (event) => {
	try {
		const client = createGraphClientFromRequest(event.request);
		const query = `
		mutation createAdvisor ($advisor: AdvisorInput){
            createAdvisor(input:{data: $advisor}){
            advisor{
                id
              }    
            }
          }
		`;
		const reqBody = await event.request.json();
		const res = await client.mutation<createAdvisorData>(query, { advisor: reqBody }).toPromise();
		if (res.data) {
			return new Response(JSON.stringify(res.data.createAdvisor.advisor));
		}
		if (res.error) {
			console.log(JSON.stringify(res.error, null, 2));
		}
	} catch (error) {
		console.error('Error creating advisor', error);
	}

	return makeEmptyResponse(500);
};
