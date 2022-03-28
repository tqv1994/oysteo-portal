import type { ResponseHeaders } from '@sveltejs/kit/types/helper';
import { createGraphClient } from '$lib/utils/graph';
import { getSessionCookie } from '$lib/utils/session';
import { languageFieldsFragment } from '$lib/store/language';
import { countryFieldsFragment } from '$lib/store/country';
import { makeEmptyResponse } from '$lib/utils/fetch';
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
import { paymentFieldsFragment } from '$lib/store/payment';
import { destinationFieldsFragment } from '$lib/store/destination';
import { interestFieldsFragment, interestTypeFieldsFragment } from '$lib/store/interest';
import {
	personalPreferenceFieldsFragment,
	personalPreferenceTypeFieldsFragment,
	travelPreferenceFieldsFragment,
	travelPreferenceTypeFieldsFragment
} from '$lib/store/preference';
import { experienceTypeFieldsFragment } from '$lib/store/experienceType';
import { destinationTypeFieldsFragment } from '$lib/store/destinationType';
import { advisorAgencyFieldsFragment, advisorFieldsFragment } from '$lib/store/advisor';
import { addressFieldsFragment } from '$lib/store/address';
import { agencyFieldsFragment } from '$lib/store/agency';
import { paymentMethodFieldsFragment } from '$lib/store/paymentMethod';
import { experienceFieldsFragment } from '$lib/store/experience';

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
    myAdvisors {
      id
    }
    advisorMe {
      ...advisorFields
    }
    agencyMe {
      ...agencyFields
    }
  }
}
${advisorFieldsFragment}
${agencyFieldsFragment}
${destinationFieldsFragment}
${experienceFieldsFragment}
${experienceTypeFieldsFragment}
${countryFieldsFragment}
${languageFieldsFragment}
${affiliatteAgencyFieldsFragment}
${affiliatteNetworkFieldsFragment}
${affiliatteBenefitProgramFieldsFragment}
${addressFieldsFragment}
${uploadFileFieldsFragment}
${salutationFieldsFragment}
${paymentFieldsFragment}
${paymentMethodFieldsFragment}
${advisorAgencyFieldsFragment}
`;

const metadataQuery = `query {
  salutationTypes (sort:"name"){
      ...salutationTypeFields
  }
  paymentMethods (sort:"name"){
    ...paymentMethodFields
  }
  countries (sort:"order:asc,name:asc"){
      ...countryFields
  }
  languages (sort:"name"){
      ...languageFields
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
  destinationTypes{
    ...destinationTypeFields
  }
}
${destinationTypeFieldsFragment}
${experienceTypeFieldsFragment}
${salutationFieldsFragment}
${languageFieldsFragment}
${countryFieldsFragment}
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
	const request = event.request;
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
		const cookie = request.headers.get('cookie');
		if (cookie) {
			const sessionCookie = getSessionCookie(cookie);
			if (sessionCookie) {
				try {
					const client = createGraphClient(sessionCookie);
					const res = await client.query<QueryData>(meQuery).toPromise();
					if (res.error) {
						if (res.error.networkError) {
							throw res.error.networkError;
						}
						if (res.error.response.headers) {
							const setCookie = res.error.response.headers.getAll('set-cookie');
							if (setCookie) {
								headers['set-cookie'] = setCookie;
							}
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
		for (const key in headers) {
			response.headers.set(key, headers[key]);
		}
		return response;
	} catch (err) {
		return makeEmptyResponse(
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
