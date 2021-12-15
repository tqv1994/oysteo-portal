import type { SalutationType } from './salutationType';
import type { Identifiable, Nameable } from './types';

export type PaymentMethod = Identifiable & Nameable;

export const paymentMethodFieldsFragment = `
fragment paymentMethodFields on PaymentMethod{
    id
    name
}
`;

export type Payment = Identifiable & {
	firstName: string;
	lastName: string;
	phone: string;
	countryCode: string;
	email: string;
	initials: string;
	paymentMethod: PaymentMethod;
	salutationType: SalutationType;
};

export const paymentFieldsFragment = `
fragment paymentFields on BillPayment{
    id
    firstName
    lastName
    phone
    countryCode
    email
    initials
    paymentMethod{
        ...paymentMethodFields
    }
    salutationType{
        ...salutationTypeFields
    }
}
`;
