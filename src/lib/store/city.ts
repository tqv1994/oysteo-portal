import { writable } from 'svelte/store';
import type { Base, CollectionStore, Identifiable, Nameable } from './types';

export type City = Identifiable &
	Nameable & {
		description?: string;
		lat?: number;
        long?: number;
	};

export const cityStore = writable<CollectionStore<City>>({
	items: {}
});

export const cityFieldsFragment = `
fragment cityFields on Country {
  id
  name
  lat
  long
}
`;
