import { writable } from 'svelte/store';
import type { UploadFile } from './upload-file';
import type { AsyncStore, Publishable } from './types';
import type { Advisor, AdvisorUser } from './advisor';
import type { Agency } from './agency';
import type { Traveller } from './traveller';

export const authStore = writable<
	AsyncStore & {
		user?: User;
	}
>({
	user: undefined
});

export type User = Publishable & {
	username: string;
	surname: string;
	name: string;
	mobile: string;
	location?: string;
	birthday?: string;
	height?: number;
	weight?: number;
	notes?: string;
	email?: string;
	phoneNumber?: string;
	provider: string;
	confirmed: boolean;
	blocked: boolean;
	avatar: UploadFile;
	myAdvisors: Advisor[];
	advisorMe?: Advisor;
	agencyMe?: Agency;
  travellerMe?: Traveller;
};

export const userFieldsFragment = `
fragment userFields on UsersPermissionsUser  {
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
`;

export const subUserFieldsFragment = `
fragment subUserFields on UsersPermissionsUser  {
    id
    name
    username
    email
    avatar {
      ...uploadFileFields
    }
}
`;
