import { writable } from 'svelte/store';
import type { AsyncStore } from './types';

export const isFormSavingStore = writable<
	AsyncStore & {
		saving?: boolean;
	}
>({
	saving: false
});
