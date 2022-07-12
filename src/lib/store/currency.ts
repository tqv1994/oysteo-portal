import type { Base } from './types';

export type Currency = Base & {
	name: string;
	prefix: string;
	suffix: string;
	locale: string;
	code: string;
};
