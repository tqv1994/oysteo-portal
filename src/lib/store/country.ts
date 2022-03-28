import { writable } from 'svelte/store';
import type { Base, CollectionStore, Identifiable, Nameable } from './types';

export type Country = Identifiable &
	Nameable & {
		code?: string;
		phone?: number;
		order?: number;
	};

export const countryStore = writable<CollectionStore<Country>>({
	items: {}
});

export const countryFieldsFragment = `
fragment countryFields on Country {
  id
  name
  code
  phone
  order
}
`;
