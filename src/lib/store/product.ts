import { writable } from 'svelte/store';
import type { Exhibitable, Identifiable } from './types';

export const productStore = writable<Product[]>([]);

export type Product = Identifiable &
	Exhibitable & {
		brand: string;
		price: string;
		intro: string;
		available: boolean;
	};
