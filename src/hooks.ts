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
import { destinationFieldsFragment } from '$lib/store/destination';
import { interestFieldsFragment, interestTypeFieldsFragment } from '$lib/store/interest';
import { personalPreferenceFieldsFragment, personalPreferenceTypeFieldsFragment, travelPreferenceFieldsFragment, travelPreferenceTypeFieldsFragment } from '$lib/store/preference';
import { cityFieldsFragment } from '$lib/store/city';
import { experienceTypeFieldsFragment } from '$lib/store/experienceType';

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
	  name
	  destinations{
		  ...destinationFields
	  }
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
${destinationFieldsFragment}
${countryFieldsFragment}
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
	interestTypes{
		...interestTypeFields
	}
	travelPreferenceTypes{
		...travelPreferenceTypeFields
	}
	personalPreferenceTypes{
		...personalPreferenceTypeFields
	}
	experienceTypes (sort:"name") {
        ...experienceTypeFields
    }
}
${experienceTypeFieldsFragment}
${salutationFieldsFragment}
${languageFieldsFragment}
${countryFieldsFragment}
${experienceFieldsFragment}
${affiliatteAgencyFieldsFragment}
${affiliatteBenefitProgramFieldsFragment}
${affiliatteNetworkFieldsFragment}
${paymentMethodFieldsFragment}
${interestTypeFieldsFragment}
${interestFieldsFragment}
${travelPreferenceTypeFieldsFragment}
${travelPreferenceFieldsFragment}
${personalPreferenceTypeFieldsFragment}
${personalPreferenceFieldsFragment}
`;

let counter = 0;
let metadata: Metadata;

/** @type {import('@sveltejs/kit').Handle} */
export const handle: Handle = async ({ event, resolve }) => {
	console.log('Handling', event.url.pathname, event.url.searchParams.toString(), ++counter);

	if (metadata) {
		event.locals.metadata = metadata;
	} else {
		console.log('Loading metadata...');
		const client = createGraphClient();
		try {
			const res = await client.query<Metadata>(metadataQuery).toPromise();
			if (res.data) {
				metadata = res.data;
				event.locals.metadata = res.data;
			} else if (res.error) {
				console.error(res.error.message);
			}
		} catch (err) {
			console.error('Error fetching metadata', err);
		}
	}

  const headers: Record<string, string> = {};
	if (!event.locals.user) {
		if (event.request.headers.get('cookie')) {
			const cookie = getSessionCookie(event.request.headers.get('cookie'));
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
					event.locals.user = res.data?.me;
				} catch (err) {
					console.error('Error fetching profile', err);
				}
			}
		}
	}

	try {
		console.log('Resuming request...', event.url.pathname, counter);
		const response = await resolve(event);
    const body = await response.text();

    for (const key in headers) {
      response.headers.set(key, headers[key]);
    }

    return new Response(body, response);
	} catch (err) {
		return makeErrorResponse(
			500,
			'INTERNAL_SERVER_ERROR',
			`There was an error loading ${event.url.pathname}: ${err.message}`
		);
	}
};

/** @type {import('@sveltejs/kit').GetSession} */
export const getSession: GetSession = async (event) => {
	return event.locals;
};
