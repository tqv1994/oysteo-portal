import { writable } from 'svelte/store';
import type { Base, CollectionStore, Identifiable, Nameable } from './types';

export type Language = Identifiable & Nameable;

export const languageStore = writable<CollectionStore<Language>>({
	items: {}
});

export const languageFieldsFragment = `
fragment languageFields on Language {
  id
  name
}
`;
