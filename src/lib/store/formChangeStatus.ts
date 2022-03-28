import { writable } from 'svelte/store';
import type { AsyncStore } from './types';

export const formChangeStatusStore = writable<
	AsyncStore & {
		changing?: boolean;
	}
>({
	changing: false
});
