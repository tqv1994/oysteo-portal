import type { ResponseHeaders } from '@sveltejs/kit/types/helper';
import { createGraphClient } from '$lib/utils/graph';
import { getSessionCookie } from '$lib/utils/session';
import { languageFieldsFragment } from '$lib/store/language';
import { countryFieldsFragment } from '$lib/store/country';
import { makeErrorResponse } from '$lib/utils/fetch';
import { experienceFieldsFragment } from '$lib/store/experience';
import {
	affiliatteAgencyFieldsFragment,
	affiliatteBenefitProgramFieldsFragment,
	affiliatteNetworkFieldsFragment
} from '$lib/store/affiliate';
import type { Locals } from '$lib/store/local';
import type { Metadata } from '$lib/store/metadata';
import type { GetSession, Handle } from '@sveltejs/kit';
import { salutationFieldsFragment } from '$lib/store/salutationType';
import { uploadFileFieldsFragment } from '$lib/store/upload-file';
import type { User } from '$lib/store/auth';
import { paymentMethodFieldsFragment } from '$lib/store/payment';

type QueryData = {
	me?: User;
};

const meQuery = `query {
  me {
	id
    name
    username
    email
    confirmed
    blocked
    avatar {
      ...uploadFileFields
    }
    advisorMe {
      id
    }
    myAdvisors {
      id
    }
	agencyMe {
		id
	}
  }
}
${uploadFileFieldsFragment}
`;

const metadataQuery = `query {
    salutationTypes (sort:"name"){
        ...salutationTypeFields
    }
	paymentMethods (sort:"name"){
		...paymentMethodFields
	}
    countries (sort:"name"){
        ...countryFields
    }
    languages (sort:"name"){
        ...languageFields
    }
    experiences (sort:"name") {
        ...experienceFields
    }
    affiliateAgencies (sort:"name"){
        ...affiliateAgencyFields
    }
    affiliateNetworks (sort:"name"){
        ...affiliateNetworkFields
    }
    affiliateBenefitPrograms (sort:"name"){
        ...affiliateBenefitProgramFields
    }
}
${salutationFieldsFragment}
${languageFieldsFragment}
${countryFieldsFragment}
${experienceFieldsFragment}
${affiliatteAgencyFieldsFragment}
${affiliatteBenefitProgramFieldsFragment}
${affiliatteNetworkFieldsFragment}
${paymentMethodFieldsFragment}
`;

let counter = 0;
let metadata: Metadata;

/** @type {import('@sveltejs/kit').Handle} */
export const handle: Handle<Locals> = async ({ request, resolve }) => {
	console.log('Handling', request.path, request.query.toString(), ++counter);

	if (metadata) {
		request.locals.metadata = metadata;
	} else {
		console.log('Loading metadata...');
		const client = createGraphClient();
		try {
			const res = await client.query<Metadata>(metadataQuery).toPromise();
			if (res.data) {
				metadata = res.data;
				request.locals.metadata = res.data;
			} else if (res.error) {
				console.error(res.error.message);
			}
		} catch (err) {
			console.error('Error fetching metadata', err);
		}
	}

	const headers: ResponseHeaders = {};
	if (!request.locals.user) {
		if (request.headers.cookie) {
			const cookie = getSessionCookie(request.headers.cookie);
			if (cookie) {
				console.log('Authenticating user from cookie...');
				try {
					const client = createGraphClient(cookie);
					const res = await client.query<QueryData>(meQuery).toPromise();
					if (res.error) {
						console.error('Failed to get session:', res.error.message);
						const setCookie = res.error.response.headers.getAll('set-cookie');
						if (setCookie) {
							headers['set-cookie'] = setCookie;
						}
					}
					request.locals.user = res.data?.me;
				} catch (err) {
					console.error('Error fetching profile', err);
				}
			}
		}
	}

	try {
		console.log('Resuming request...', request.path, counter);
		const response = await resolve(request);

		return {
			...response,
			headers: {
				...response.headers,
				...headers
			}
		};
	} catch (err) {
		return makeErrorResponse(
			500,
			'INTERNAL_SERVER_ERROR',
			`There was an error loading ${request.path}: ${err.message}`
		);
	}
};

/** @type {import('@sveltejs/kit').GetSession} */
export const getSession: GetSession<Locals, unknown, Locals> = async (request) => {
	return request.locals;
};
