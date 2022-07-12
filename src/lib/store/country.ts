import { get, writable } from 'svelte/store';
import type { Kind } from './category';

export type Country = Kind & {
		code?: string;
		phone?: number;
		order?: number;
	};

export const countryStore = writable<Country[]>([]);

let countryMap: Record<string, Country>;
export function getCountryById(id: string): Country | undefined {
	if (!id) {
		return;
	}
	if (!countryMap) {
		countryMap = {};
		for (const country of get(countryStore)) {
			countryMap[country.id] = country;
		}
	}
	return countryMap[id];
}
