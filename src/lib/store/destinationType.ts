import { writable } from 'svelte/store';
import type { Category } from './category';
import type { Base, CollectionStore, Identifiable, Nameable } from './types';

export const destinationTypeStore = writable<CollectionStore<Category>>({
	items: {}
});

export type DestinationType = Base &
	Nameable & {
		name: string;
	};

export const destinationTypeFieldsFragment = `
fragment destinationTypeFields on DestinationType {
  id
  name
}
`;
