import type { Base } from './types';
import type { Advisor } from './advisor';
import type { Destination } from './destination';
import type { Document } from './document';
import type { Insurance } from './insurance';
import type { Traveller } from './traveller';
import type { Emergency } from './emergency';
import { dateDiffInDays, formatMonthAndYear } from '$lib/helpers/datetime';
import type { TripWhere } from './tripWhere';
import type { TravelingWithYou } from './travelingWithYou';
import type { LodgingType } from './lodgingType';
import type { RoomStyle } from './roomStyle';
import type { Experience } from './experience';
import type { Currency } from './currency';
import type { RoomPreference } from './roomPreference';
export type Trip = Base & {
	lead_traveller: Traveller;
	advisor: Advisor;
	description: string;
	note: string;
	state: string;
	reference: string;
	depart_at: string;
	return_at: string;
	destinations: Destination[];
	travellers: Traveller[];
	budget: number;
	vaccinated: boolean;
	documents: Document[];
	insurance: Insurance;
	emergencies: Emergency[];
	emergencyName: string;
	emergencyPhone: string;
	emergencyRole: string;
	emergencyReference: string;
	updated_at: string;
	tripWheres: TripWhere[];
	numberOfNights?: number;
    numberOfAdults?: number;
    numberOfChildren?: number;
    numberOfRoom?: number;
    desiredDestinations?: string;
    lodgingTypeOther?: string;
    needFlights?: boolean;
    travelByFlight?: string;
    travelAnotherWay?: string;
    numberOfTripsInSixMonths?: string;
    experiences?: Experience[];
    travelingWithYous?: TravelingWithYou[];
    lodgingTypes?: LodgingType[];
    roomStyles?: RoomStyle[];
    currency?: Currency;
    destinationTypes?: Destination[];
    roomPreferences?: RoomPreference[];
    additionalInfo?: string;
    policyId: string;
    contact: string;
    website: string;
};

export class TRipInput {
	lead_traveller: string; // ID
	advisor: string; // ID
	description: string;
	note: string;
	state: string;
	reference: string;
	depart_at: string | Date;
	return_at: string | Date;
	destinations: string[]; // ID[]
	currency: string;
	budget: number;
	vaccinated: boolean;
	documents: string[]; // ID[]
	insurance: string; // ID[]
    emergencies: Emergency[];
	travellers: string[]; // ID[]
	published_at: string | Date;
	emergencyName: string;
	emergencyPhone: string;
	emergencyRole: string;
	emergencyReference: string;
	tripWheres: string[]; // ID[]
	numberOfNights: number;
    numberOfAdults: number;
    numberOfChildren: number;
    numberOfRoom: number;
    desiredDestinations: string;
    lodgingTypeOther: string;
    needFlights: boolean;
    travelByFlight: string;
    travelAnotherWay: string;
    numberOfTripsInSixMonths: number;
    experiences: string[]; // ID[]
    travelingWithYous: string[]; // ID[]
    lodgingTypes: string[]; // ID[]
    roomStyles: string[]; // ID []
    destinationTypes: string[]; // ID[]
    roomPreferences: string[]; //ID[]
    additionalInfo?: string;
    policyId: string;
    contact: string;
    website: string;

	constructor(values: Object = {}) {
		Object.assign(this, values);
	}
}

export const convertTripToInput = (trip: Trip): TRipInput => {
	let result: TRipInput;
	const data: any = { ...trip };
	data.lead_traveller = trip.lead_traveller?.id;
	data.advisor = trip.advisor?.id;
	data.destinations = (trip.destinations || []).map((destination) => destination.id);
	data.documents = (trip.documents || []).map((item) => item.id);
	// data.insurance = (trip.insurance || []).map((item) => item.id);
	data.emergencies = (trip.emergencies || []).map((item) => item.id);
	data.travellers = (trip.travellers || []).map((item) => item.id);
	data.tripWheres = (trip.tripWheres || []).map((item) => item.id);
	data.experiences = (trip.experiences || []).map((item)=>item.id+"");
    data.travelingWithYous = (trip.travelingWithYous || []).map((item)=>item.id+"");
    data.lodgingTypes = (trip.lodgingTypes || []).map((item)=>item.id + "");
    data.roomStyles = (trip.roomStyles || []).map((item) => item.id + "");
    data.currency = trip.currency?.id;
    data.destinationTypes = (trip.destinationTypes || []).map((item)=> item.id + "");
    data.roomPreferences = (trip.roomPreferences || []).map((item)=> item.id+"");
	delete data.id;
	delete data.updated_at;
	delete data.__typename;
	result = new TRipInput(data);
	return result;
};

export enum ENUM_TRIP_STATE {
	new_enquiry = 'new_enquiry',
	enquired = 'enquired',
	planning = 'planning',
	progressing = 'progressing',
	completed = 'completed',
    reject = 'reject'
}

export const ENUM_TRIP_STATE_LABEL = {
	new_enquiry: 'New Enquiry',
	enquired: 'Enquired',
	planning: 'Planning',
	progressing: 'Progressing',
	completed: 'Completed',
    reject: 'Reject'
};

export const getDatesTrip = (trip: Trip): string => {
	return `${dateDiffInDays(trip.depart_at, trip.return_at)} nights, ${formatMonthAndYear(
		trip.depart_at
	)}, ${formatMonthAndYear(trip.return_at)}`;
};

export const getTravellersString = (trip: Trip): string => {
	let countAdult = 0;
	let countChildren = 0;
	let travellers = [];
	if (!trip.lead_traveller && !trip.travellers) {
		return '0 adult, 0 children';
	}
	if (trip.travellers && trip.travellers.length) {
		travellers = [...trip.travellers];
	}
	if (trip.lead_traveller) {
		travellers.push(trip.lead_traveller);
	}
	travellers.map((traveller) => {
		if (
			traveller.birthday &&
      // TODO: Use dayjs for date maths
			new Date().getFullYear() - new Date(traveller.birthday).getFullYear() >= 15
		) {
			countAdult += 1;
		} else {
			countChildren += 1;
		}
	});
	return `${countAdult} adults, ${countChildren} children`;
};

// export const tripFieldsFragment = `
// fragment tripFields on Trip{
//     id
//     lead_traveller{
//         ...travellerFields
//     }
//     advisor{
//        id
//        name
//     }
//     description
//     note
//     state
//     reference
//     depart_at
//     return_at
//     destinations{
//         ...destinationFields
//     }
//     travellers{
//         ...travellerFields
//     }
//     documents{
//         ...documentFields
//     }
//     insurance{
//         ...insuranceFields
//     }
//     budget
//     vaccinated
//     emergencies{
//         ...emergencyFields
//     }
// }
// `;
export const tripFieldsFragment = `
fragment tripFields on Trip{
    id
    lead_traveller{
        ...travellerFields
    }
    advisor{
       id
       name
    }
    description
    note
    state
    reference
    depart_at
    return_at
    destinations{
        ...destinationFields
    }
    travellers{
        ...travellerFields
    }
    documents{
        ...documentFields
    }
    insurance{
        ...insuranceFields
    }
    budget
    vaccinated
    emergencyName
    emergencyPhone
    emergencyRole
    emergencyReference
    updated_at
    tripWheres {
        ...tripWhereFields
    }
	numberOfNights
    numberOfAdults
    numberOfChildren
    numberOfRoom
    desiredDestinations
    lodgingTypeOther
    needFlights
    travelByFlight
    travelAnotherWay
    numberOfTripsInSixMonths
    experiences{
        ...experienceFields
    }
    travelingWithYous{
        ...travelingWithYouFields
    }
    lodgingTypes {
        ...lodgingTypeFields
    }
    roomStyles {
        ...roomStyleFields
    }
    currency{
        ...currencyFields
    }
    roomPreferences{
        ...roomPreferenceFields
    }
    destinationTypes{
        ...destinationTypeFields
    }
    additionalInfo
    policyId
    contact
    website
    emergencies{
        ...emergencyFields
    }
}
`;

export const tripBasicFieldsFragment = `
fragment tripFields on Trip{
    id
    lead_traveller{
        id
        forename
        surname
    }
    advisor{
       id
       name
    }
    description
    note
    state
    reference
    depart_at
    return_at
    budget
    updated_at
    currency{
        ...currencyFields
    }
    additionalInfo
    policyId
    contact
    website
}
`;