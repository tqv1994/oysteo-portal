import type { Base, Nameable } from './types';
import type { Media } from './media';

export type Destination = Base &
	Nameable & {
		description?: string;
		location: string;
		date_visited?: string;
		gallery: Media[];
		intro: string;
		// videos: Media[];
	};

export const destinationFieldsFragment = `
fragment destinationFields on Destination {
    id
    name
    description
    location
    date_visited
    gallery{
      ...uploadFileFields
    }
}
`;
