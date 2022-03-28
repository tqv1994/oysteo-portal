import { writable } from 'svelte/store';
import type { Category } from './category';
import type { CollectionStore, Identifiable, Nameable } from './types';

export type AffiliateAgencies = Identifiable & Nameable;

export const affiliateAgencyStore = writable<CollectionStore<Category>>({
	items: {}
});

export type AffiliateNetwork = Identifiable & Nameable;

export const affiliateNetworkStore = writable<CollectionStore<Category>>({
	items: {}
});

export type AffiliateBenefitPrograms = Identifiable & Nameable;

export const affiliateBenefitProgramStore = writable<CollectionStore<Category>>({
	items: {}
});

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
