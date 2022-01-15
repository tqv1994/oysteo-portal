import { writable } from 'svelte/store';
import type { Category } from './category';
import type { CollectionStore } from './types';

export const experienceTypeStore = writable<CollectionStore<Category>>({
  items: {},
});

export const experienceTypeFieldsFragment = `
fragment experienceTypeFields on ExperienceType {
  id
  name
}
`;
