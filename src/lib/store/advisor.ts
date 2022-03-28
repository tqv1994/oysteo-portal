import type { Address } from './address';
import type { Language } from './language';
import type { Country } from './country';
import type { Destination } from './destination';
import type { Experience } from './experience';
import type { Base, Identifiable, Nameable } from './types';
import type { SalutationType } from './salutationType';
import type { Media } from './media';
import type { ExperienceType } from './experienceType';

export type AdvisorUser = {
	advisorMe: Advisor;
};

export type Advisor = Base &
	Nameable & {
		biography?: string;
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
		address?: Address[];
		country?: Country;
		language1?: Language;
		language2?: Language;
		language3?: Language;
		language4?: Language;
		language5?: Language;
		language6?: Language;
		experiences?: Experience[];
		destinations?: Destination[];
		avatar?: Media;
		name?: string;
		experienceTypes1?: ExperienceType;
		experienceTypes2?: ExperienceType;
		experienceTypes3?: ExperienceType;
		experienceTypes4?: ExperienceType;
		experienceTypes5?: ExperienceType;
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
    biography
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
    agency{
        id
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
    country{
        ...countryFields
    }
    language1{
        ...languageFields
    }
    language2{
        ...languageFields
    }
    language3{
        ...languageFields
    }
    language4{
        ...languageFields
    }
    language5{
        ...languageFields
    }
    language6{
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
    experienceTypes1{
        ...experienceTypeFields
    }
    experienceTypes2{
        ...experienceTypeFields
    }
    experienceTypes3{
        ...experienceTypeFields
    }
    experienceTypes4{
        ...experienceTypeFields
    }
    experienceTypes5{
        ...experienceTypeFields
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
