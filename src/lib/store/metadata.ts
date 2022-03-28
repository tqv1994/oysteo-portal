import type { AffiliateAgencies, AffiliateBenefitPrograms, AffiliateNetwork } from './affiliate';
import type { Country } from './country';
import type { DestinationType } from './destinationType';
import type { ExperienceType } from './experienceType';
import type { InterestType } from './interest';
import type { Language } from './language';
import type { PaymentMethod } from './payment';
import type { PersonalPreferenceType, TravelPreferenceType } from './preference';
import type { SalutationType } from './salutationType';

export type Metadata = {
	salutationTypes: SalutationType[];
	paymentMethods: PaymentMethod[];
	countries: Country[];
	languages: Language[];
	affiliateAgencies: AffiliateAgencies[];
	affiliateNetworks: AffiliateNetwork[];
	affiliateBenefitPrograms: AffiliateBenefitPrograms[];
	interestTypes: InterestType[];
	travelPreferenceTypes: TravelPreferenceType[];
	personalPreferenceTypes: PersonalPreferenceType[];
	experienceTypes: ExperienceType[];
	destinationTypes: DestinationType[];
};
