import type { Address } from './address';
import type { Language } from './language';
import type { Country } from './country';
import type { Destination } from './destination';
import type { Experience } from './experience';
import type { Base, Identifiable, Nameable } from './types';
import type { SalutationType } from './salutationType';

export type AdvisorUser = {
	advisorMe: Advisor;
};

export type Advisor = Base &
	Nameable & {
		description?: string;
		accept?: boolean;
		planningFee?: boolean;
		email?: string;
		phone_number?: string;
		cell_mobile?: string;
		whatsapp?: string;
		emergency?: string;
		phone_number_code?: string;
		cell_mobile_code?: string;
		whatsapp_code?: string;
		emergency_code?: string;
		initials?: string;
		email2?: string;
		linkedIn?: string;
		facebook?: string;
		joined_at?: string;
		twitter?: string;
		instagram?: string;
		pinterest?: string;
		active?: boolean;
		reference?: string;
		website?: string;
		timezone?: string;
		address?: Address;
		country?: Country;
		language1?: Language;
		experiences?: Experience[];
		destinations?: Destination[];
	};

export const advisorFieldsFragment = `
fragment advisorFields on Advisor {
    id
    name
    avatar{
      ...uploadFileFields
    }
    email
    initials
    phone_number
    cell_mobile
    whatsapp
    emergency
    phone_number_code
    cell_mobile_code
    whatsapp_code
    emergency_code
    description
    accept
    planningFee
    email2
    instagram
    facebook
    twitter
    linkedIn
    pinterest
    reference
    active
    website
    timezone
    joined_at
    country{
        ...countryFields
    }
    language1{
        ...languageFields
    }
    address{
      ...addressFields
    }
    experiences{
        ...experienceFields
    }
    destinations{
       ...destinationFields
    }
    affiliate_agencies{
        ...affiliateAgencyFields
    }
    affiliate_networks{
        ...affiliateNetworkFields
    }
    affiliate_benefit_programs{
        ...affiliateBenefitProgramFields
    }
}
`;

export type AdvisorAgency = Identifiable &
	Nameable & {
		initials: string;
		email: string;
		reference: string;
		active: boolean;
		salutationType: SalutationType;
	};

export const advisorAgencyFieldsFragment = `
fragment advisorAgencyFields on Advisor {
    id
    name
    initials
    email
    reference
    active
    salutationType{
        ...salutationTypeFields
    }
}
`;
