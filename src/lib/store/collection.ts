import type { SvelteFetch } from '$lib/utils/fetch';
import { get, writable, type Writable } from 'svelte/store';
import type { Kind } from './category';
import { searchFetch } from './search';
import type { SearchResponse } from 'meilisearch';

const stores: Record<string, Writable<Array<unknown>>> = {};
const maps: Record<string, Record<string, Kind>> = {};

const SORTING = {
	country: ['order:desc', 'name:asc']
};
const DEFAULT_SORT = ['name:asc'];

export async function getCollection<T extends Kind = Kind>(
	fetch: SvelteFetch,
	index: string
): Promise<T[]> {
	let store = stores[index] as Writable<T[]>;
	if (!store) {
		store = writable<T[]>([]);
		stores[index] = store;
	}
	let items = get(store) || [];
	if (!items.length) {
		try {
			const sort = SORTING[index] || DEFAULT_SORT;
			// const res = await searchGetAll(fetch, index, sort);
			const res = await searchFetch(fetch, index, {
				limit: 999,
				sort
			});
			if (res.ok) {
				const data: SearchResponse<T> = await res.json();
				items = data.hits;
				items.map((item) => {
					item.id = item.id.substring(index.length + 1);
				});
				store.set(items);
			} else {
				console.error('Failed to search fetch', index, res.status, await res.text());
			}
		} catch (err) {
			console.error('Error search fetch all', err);
		}
	}
	return items;
}

export async function getCollectionAsMap<T extends Kind = Kind>(
	fetch: SvelteFetch,
	index: string
): Promise<Record<string, T>> {
	let map = maps[index] as Record<string, T>;
	if (!map) {
		const items = await getCollection<T>(fetch, index);
		map = {};
		for (const item of items) {
			const id = item.id.substring(item.id.lastIndexOf('-') + 1);
			map[id] = item;
		}
	}
	return map;
}
