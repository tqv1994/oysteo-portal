import { writable } from 'svelte/store';
import type { Category } from './category';
import type { CollectionStore, Identifiable, Nameable } from './types';

export type PaymentMethod = Identifiable & Nameable;

export const paymentMethodStore = writable<CollectionStore<Category>>({
	items: {}
});

export const paymentMethodFieldsFragment = `
fragment paymentMethodFields on PaymentMethod{
    id
    name
}
`;
