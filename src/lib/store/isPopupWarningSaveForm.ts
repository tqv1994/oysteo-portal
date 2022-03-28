import { writable } from 'svelte/store';
import type { AsyncStore } from './types';

export const isPopupWarningSaveFormStore = writable<
	AsyncStore & {
		open?: boolean;
	}
>({
	open: false
});
