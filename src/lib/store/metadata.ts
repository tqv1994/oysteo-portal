import type { AffiliateAgencies, AffiliateBenefitPrograms, AffiliateNetwork } from './affiliate';
import type { Country } from './country';
import type { Experience } from './experience';
import type { Language } from './language';
import type { PaymentMethod } from './payment';
import type { SalutationType } from './salutationType';

export type Metadata = {
	salutationTypes: SalutationType[];
	paymentMethods: PaymentMethod[];
	countries: Country[];
	languages: Language[];
	experiences: Experience[];
	affiliateAgencies: AffiliateAgencies[];
	affiliateNetworks: AffiliateNetwork[];
	affiliateBenefitPrograms: AffiliateBenefitPrograms[];
};
