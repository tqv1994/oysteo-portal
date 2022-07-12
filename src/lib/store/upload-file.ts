import { writable } from 'svelte/store';
import type { Publishable } from './types';

export const FileStore = writable<File[]>([]);

export type UploadFile = Publishable & {
	name?: string;
	alternativeText?: string;
	caption?: string;
	width?: number;
	height?: number;
	url: string;
	formats?: {
		thumbnail: Image;
		medium: Image;
		small: Image;
	};
	blurHash?: string;
	hash?: string;
};

export type Image = {
	name: string;
	hash: string;
	ext: string;
	mime: string;
	width: number;
	height: number;
	size: number;
	path: string;
	url: string;
};
