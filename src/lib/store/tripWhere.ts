import type { Base } from './types';
import { dateDiffInDays, formatMonthAndYear } from '$lib/helpers/datetime';
import type { Trip } from './trip';
import type { Country } from './country';
export type TripWhere = Base & {
	description: string;
	noNights: number;
	trip: Trip;
	country: Country;
};

export class TripWhereInput {
	description: string;
	noNights: number;
	trip: string; // ID
	country: string; // ID

	constructor(values: Object = {}) {
		Object.assign(this, values);
	}
}

export const convertTripWhereToInput = (tripWhere: TripWhere): TripWhereInput => {
	let result: TripWhereInput;
	const data: any = { ...tripWhere };
	data.country = (tripWhere.country?.id || '') + '';
	data.trip = (tripWhere.trip?.id || '') + '';
	delete data.id;
	delete data.__typename;
	result = new TripWhereInput(data);
	return result;
};

export const tripWhereFieldsFragment = `
fragment tripWhereFields on TripWhere{
    id
    description
    noNights
    country{
        ...countryFields
    }
}
`;
