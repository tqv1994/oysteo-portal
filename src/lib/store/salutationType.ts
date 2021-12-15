import { writable } from 'svelte/store';
import type { Category } from './category';
import type { CollectionStore, Identifiable, Nameable } from './types';

export const salutationTypeStore = writable<CollectionStore<Category>>({
	items: {}
});
export type SalutationType = Identifiable & Nameable;

export const salutationFieldsFragment = `
fragment salutationTypeFields on SalutationType  {
    id
    name
}
`;
