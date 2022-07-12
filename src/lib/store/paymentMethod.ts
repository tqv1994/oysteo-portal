import { writable } from 'svelte/store';
import type { Kind } from './category';

export const paymentMethodStore = writable<Kind[]>([]);
