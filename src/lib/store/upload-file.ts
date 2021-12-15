import { writable } from 'svelte/store';
import type { CollectionStore, Publishable } from './types';

export const FileStore = writable<CollectionStore<File>>({
	items: {}
});

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

export const uploadFileFieldsFragment = `
fragment uploadFileFields on UploadFile {
  id
  name
  alternativeText
  caption
  blurHash
  width
  height
  formats
  hash
  size
  url
  previewUrl
}
`;
