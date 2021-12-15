import type { Identifiable, Nameable } from './types';

export type AffiliateAgencies = Identifiable & Nameable;

export type AffiliateNetwork = Identifiable & Nameable;

export type AffiliateBenefitPrograms = Identifiable & Nameable;

export const affiliatteAgencyFieldsFragment = `
fragment affiliateAgencyFields on AffiliateAgency {
    id
    name
}
`;

export const affiliatteNetworkFieldsFragment = `
fragment affiliateNetworkFields on AffiliateNetwork {
    id
    name
}
`;

export const affiliatteBenefitProgramFieldsFragment = `
fragment affiliateBenefitProgramFields on AffiliateBenefitProgram {
    id
    name
}
`;
