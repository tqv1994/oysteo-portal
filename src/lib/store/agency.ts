import type { Address } from './address';
import type { Base, Nameable } from './types';
import type { Media } from './media';
import type { Kind } from './category';
import type { Advisor } from './advisor';

export type Agency = Base &
	Nameable & {
		legalName: string;
		description?: string;
		state?: string;
		type?: AGENCY_TYPE;
		profile?: string;
		logo?: Media;
		images?: Media[];
		website?: string;
		registrationId?: string;
		taxId?: string;
		timezone?: string;
		insurance_company?: string;
		insurance_policy?: string;
		iata?: string;
		abta?: string;
		arc?: string;
		tids?: string;
		clia?: string;
		atol?: string;
		established_at?: string;
		email?: string;
		phone_number?: string;
		phone_number_code?: string;
		cell_mobile?: string;
		cell_mobile_code?: string;
		whatsapp?: string;
		whatsapp_code?: string;
		emergency?: string;
		emergency_code?: string;
		affiliate_networks?: Kind[];
		affiliate_agencies?: Kind[];
		affiliate_benefit_programs?: Kind[];
		address?: Address;
		advisors?: Advisor[];
		billingPhone?: string;
		billingEmail?: string;
		billingInitials?: string;
		billingFirstName?: string;
		billingLastName?: string;
		billingPaymentMethod?: Kind;
		billingCountryCode?: string;
		billingSalutationType?: Kind;
	};

export enum AGENCY_TYPE {
	company = 'company',
	individual = 'individual'
}
