import { writable } from 'svelte/store';
import type { Category } from './category';
import type { CollectionStore, Identifiable, Nameable } from './types';

export type ExperienceType = Identifiable & Nameable;

export const experienceTypeStore = writable<CollectionStore<Category>>({
  items: {},
});

export const experienceTypeFieldsFragment = `
fragment experienceTypeFields on ExperienceType {
  id
  name
}
`;
