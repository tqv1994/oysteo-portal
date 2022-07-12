import type { Country } from '$lib/store/country';
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

export function sortDate(a, b) {
	const diff = new Date(a).getTime() - new Date(b).getTime();
	if (diff > 0) {
		return 1;
	} else if (diff < 0) {
		return -1;
	}
	return 0;
}

export function sortByOrder<T extends Country>(items: T[]): T[] {
	return items.sort((a, b) => {
		if (a.order === null) {
			return 1;
		} else if (b.order === null) {
			return -1;
		} else if (a.order > b.order) {
			return 1;
		} else if (a.order < b.order) {
			return -1;
		} else return 0;
	});
}
