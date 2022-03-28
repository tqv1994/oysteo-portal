import { writable } from 'svelte/store';
import type { CollectionStore, Exhibitable, Identifiable } from './types';

export const productStore = writable<CollectionStore<Product>>({
	items: {}
});

export type Product = Identifiable &
	Exhibitable & {
		brand: string;
		price: string;
		intro: string;
		available: boolean;
	};

export const productFieldsFragment = `
fragment productFields on Product {
  id,
  name,
  intro
  description,
  brand,
  price
  gallery {
    ...uploadFileFields
  }
  tags
  available
}
`;
