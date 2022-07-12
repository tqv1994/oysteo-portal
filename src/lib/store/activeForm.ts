import { notify } from '$lib/components/Toast.svelte';
import { getFormValues } from '$lib/helpers/utils';
import { get, writable } from 'svelte/store';

type ActiveForm = { id: string; data: Record<string, string | number | boolean> };
const store = writable<ActiveForm | undefined>();

let timer: NodeJS.Timeout;

export const { subscribe } = store;

export function isDirty(): boolean {
	const s = get(store);
	if (!s || !s.data) {
		return false;
	}
	const { id, data } = s;
	const form = document.getElementById(id) as HTMLFormElement;
	const values = getFormValues(form);
	for (const k in data) {
		if (values[k] != data[k]) {
			return true;
		}
	}
	return false;
}

export function highlight() {
	const s = get(store);
	if (!s) {
		return false;
	}
	const { id } = s;
	const form = document.getElementById(id) as HTMLFormElement;
	notify({
		title: 'Unsaved changes',
		subtitle: 'Please save or cancel your changes before continuing',
		timeout: 3000
	});
	form.style.outline = '3px solid red';
	form.style.outlineOffset = '1em';
	form.scrollIntoView({ block: 'center', inline: 'center' });
	if (timer) {
		clearTimeout(timer);
	}
	timer = setTimeout(() => {
		form.style.outline = 'none';
	}, 3500);
}

export function activate(id: string, data: Record<string, string | number | boolean>) {
	store.set({ id, data });
}

export function activateOrHighlight(id: string, data: Record<string, string | number | boolean>) {
	const s = get(store);
	if (s && s.id) {
		if(s.id === id){
			activate(id, data);
			return;
		}
	}
	if (isDirty()) {
		highlight();
	} else {
		activate(id, data);
	}
}

export function clear() {
	store.set(undefined);
}
