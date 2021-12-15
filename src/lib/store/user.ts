import type { Identifiable, Recordable } from './types';
import type { Media } from './media';

export type Role = {
	id: number;
	name: string;
	type: string;
};

export type User = Identifiable &
	Recordable & {
		username: string;
		email: string;
		provider: string;
		password: string;
		resetPasswordToken: string;
		confirmationToken: string;
		confirm: boolean;
		blocked: boolean;
		role: Role;
		location: string;
		idToken: string;
		firebaseUid: string;
		avatar: Media;
	};

export const roleFieldsFragment = `
fragment roleFields on Role {
    id
    name
    type
}
`;

export const userFieldsFragment = `
fragment userFields on User {
    id
    name
    username
    email
    confirmed
    blocked
    role {
        ...roleFields
    }
    advisorMe{
       ...advisorFields
    }
}
`;
