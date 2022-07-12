import type { Kind } from './category';
import type { Country } from './country';

export type Metadata = {
	salutationTypes: Kind[];
	paymentMethods: Kind[];
	countries: Country[];
	languages: Kind[];
	affiliateAgencies: Kind[];
	affiliateNetworks: Kind[];
	affiliateBenefitPrograms: Kind[];
	interestTypes: Kind[];
	travelPreferenceTypes: Kind[];
	personalPreferenceTypes: Kind[];
	experienceTypes: Kind[];
	destinationTypes: Kind[];
};
