import { writable } from 'svelte/store';
import type { Category } from './category';
import type { CollectionStore, Identifiable, Nameable } from './types';

export const destinationTypeStore = writable<CollectionStore<Category>>({
  items: {},
});

export const destinationTypeFieldsFragment = `
fragment destinationTypeFields on DestinationType {
  id
  name
}
`;
