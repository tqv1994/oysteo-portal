import { writable } from 'svelte/store';

export type GlobalState = {
	savingAnchors: Record<string, Promise<unknown>>;
	editingAnchor?: string;
};

export const globalState = writable<GlobalState>({
	savingAnchors: {}
});
