import type { Base, Nameable } from './types';
import type { Media } from './media';

export type Destination = Base &
	Nameable & {
		description?: string;
		location?: string;
		date_visited?: string;
		gallery: Media[];
		intro?: string;
		country?: string;
		visible?: boolean;
		advisor?: {
			id: string;
		};
		// videos: Media[];
	};
