import { writable } from 'svelte/store';
import type { Kind } from './category';

export type City = Kind & {
	description?: string;
	lat?: number;
	long?: number;
};

export const cityStore = writable<City[]>([]);
