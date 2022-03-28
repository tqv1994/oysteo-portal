import { writable } from 'svelte/store';
import type { UploadFile } from './upload-file';
import type { AsyncStore, Publishable } from './types';
import type { Advisor, AdvisorUser } from './advisor';
import type { Agency } from './agency';
import type { Traveller } from './traveller';
import type { Product } from './product';
import type { Experience } from './experience';
import type { Destination } from './destination';

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
	productLikes?: Product[];
	experienceLikes?: Experience[];
	destinationLikes?: Destination[];
};

export class UserInput {
	myAdvisors: string[]; // ID[]
	constructor(values: Object = {}) {
		Object.assign(this, values);
	}
}

export const convertUserToInput = (user: User) => {
	const data: UserInput = new UserInput();
	data.myAdvisors = (user.myAdvisors || []).map((item) => item.id + '');
	return data;
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
      name
    }
    myAdvisors {
      id
      name
    }
    agencyMe {
      id
      name
    }
}
`;
