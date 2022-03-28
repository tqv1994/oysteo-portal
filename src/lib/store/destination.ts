import type { Base, Nameable } from './types';
import type { Media } from './media';
import type { Country } from './country';

export type Destination = Base &
	Nameable & {
		description?: string;
		location: string;
		date_visited?: string;
		gallery: Media[];
		intro: string;
		country: Country;
		visible: boolean;
		author: {
			id: string;
		};
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
    country{
      ...countryFields
    }
    visible
    author{
      id
    }
    type1{
      id
      name
    }
}
`;
