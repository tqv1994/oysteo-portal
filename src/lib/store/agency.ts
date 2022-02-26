import type { Address } from './address';
import type { Advisor } from './advisor';
import type { AffiliateAgencies, AffiliateBenefitPrograms, AffiliateNetwork } from './affiliate';
import type { Base, Nameable } from './types';
import type { Media } from './media';

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
		affiliate_networks?: AffiliateNetwork[];
		affiliate_agencies?: AffiliateAgencies[];
		affiliate_benefit_programs?: AffiliateBenefitPrograms[];
		addresses?: Address[];
		advisors?: Advisor[];
	};
export enum AGENCY_TYPE {
	company = 'company',
	individual = 'individual'
}

export const agencyFieldsFragment = `
fragment agencyFields on Agency {
    id
    name
    description
    legalName
    state
    type
    profile
    logo{
        ...uploadFileFields
    }
    images{
        ...uploadFileFields
    }
    website
    registrationId
    taxId
    timezone
    insurance_company
    insurance_policy
    iata
    abta
    arc
    tids
    clia
    atol
    established_at
    email
    phone_number
    phone_number_code
    cell_mobile
    cell_mobile_code
    whatsapp
    whatsapp_code
    emergency
    emergency_code
    affiliate_networks{
        ...affiliateNetworkFields
    }
    affiliate_agencies{
        ...affiliateAgencyFields
    }
    affiliate_benefit_programs{
        ...affiliateBenefitProgramFields
    }
    addresses{
        ...addressFields
    }
    advisors{
        ...advisorAgencyFields
    }
    payments{
        ...paymentFields
    }
}
`;
