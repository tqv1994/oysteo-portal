import type { Nameable, Publishable } from '$lib/store/types';

export function sortByName<T extends Nameable>(items: T[]): T[] {
	return items.sort((a, b) => {
		if (a.name > b.name) {
			return 1;
		} else if (a.name < b.name) {
			return -1;
		}
		return 0;
	});
}

export function sortByPublishedAt<T extends Publishable>(items: T[]): T[] {
	return items.sort(
		(a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime()
	);
}
