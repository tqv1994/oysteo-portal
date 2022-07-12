import type { Kind } from './category';
import type { Identifiable } from './types';

export type Payment = Identifiable & {
	firstName: string;
	lastName: string;
	phone: string;
	countryCode: string;
	email: string;
	initials: string;
	paymentMethod: Kind;
	salutationType: Kind;
};
