import { writable } from 'svelte/store';
import type { Base, Nameable } from './types';
export type InterestType = Base &
	Nameable & {
		interests: Interest[];
	};
export type Interest = Base &
	Nameable & {
		type: Interest;
	};

export const interestTypeStore = writable<InterestType[]>([]);
