import { writable } from 'svelte/store';
import type { Base, Nameable } from './types';

export type TravelPreferenceType = Base &
	Nameable & {
		preferences: TravelPreference[];
	};
export type TravelPreference = Base &
	Nameable & {
		other: string;
		type: TravelPreferenceType;
	};
export const travelPreferenceTypeStore = writable<TravelPreferenceType[]>([]);

export type PersonalPreferenceType = Base &
	Nameable & {
		preferences: PersonalPreference[];
	};
export type PersonalPreference = Base &
	Nameable & {
		type: string;
	};
export const personalPreferenceTypeStore = writable<PersonalPreferenceType[]>([]);
