import type { Base, SideNavItem } from './types';
import type { Advisor } from './advisor';
import type { Destination } from './destination';
import type { Document } from './document';
import type { Insurance } from './insurance';
import type { Emergency } from './emergency';
import type { TripWhere } from './tripWhere';
import type { RoomStyle } from './roomStyle';
import type { Currency } from './currency';
import type { Kind } from './category';
import type { Traveller } from './traveller';
import { get, writable } from 'svelte/store';
import type { User } from './auth';

export type Trip = Base & {
	user?: User;
	advisor?: Advisor;
	description?: string;
	note?: string;
	state: TripState;
	reference?: string;
	depart_at?: string;
	return_at?: string;
	destinations?: Destination[];
	travellers?: Traveller[];
	budget?: number;
	vaccinated?: boolean;
	documents?: Document[];
	insurance?: Insurance;
	emergencies?: Emergency[];
	emergencyName?: string;
	emergencyPhone?: string;
	emergencyRole?: string;
	emergencyReference?: string;
	updated_at?: string;
	tripWheres?: TripWhere[];
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
	experienceTypes?: Kind[];
	travelGroupTypes?: Kind[];
	lodgingTypes?: Kind[];
	roomStyles?: RoomStyle[];
	currency?: Currency;
	destinationTypes?: Destination[];
	roomPreferences?: Kind[];
	additionalInfo?: string;
	policyId?: string;
	contact?: string;
	website?: string;
	nightlyBudget: number;
};

export type TripGroup = SideNavItem & {
	trips: Trip[];
};

export class TRipInput {
	advisor: string; // ID
	description: string;
	note: string;
	state: TripState;
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
	experienceTypes: string[]; // ID[]
	travelGroupTypes: string[]; // ID[]
	lodgingTypes: string[]; // ID[]
	roomStyles: string[]; // ID []
	destinationTypes: string[]; // ID[]
	roomPreferences: string[]; //ID[]
	additionalInfo?: string;
	policyId: string;
	contact: string;
	website: string;
	nightlyBudget: number;

	constructor(values: Object = {}) {
		Object.assign(this, values);
	}
}

export const tripStore = writable<Trip[]>([]);
export const tripLeadStore = writable<Trip[]>([]);

// export const updateTripToTripStore = (newTrip: Trip, oldTrip?: Trip): Trip => {
	// tripStore.update((s) => {
	// 	if (oldTrip) {
	// 		if (oldTrip.lead_traveller == null) {
	// 			const travellers = get(travellersStore);
	// 			newTrip.lead_traveller = travellers.find(
	// 				(item) => item.id.toString() === newTrip?.lead_traveller?.id?.toString()
	// 			);
	// 		} else {
	// 			newTrip.lead_traveller = oldTrip.lead_traveller;
	// 		}
	// 	} else {
	// 		const travellers = get(travellersStore);
	// 		newTrip.lead_traveller = travellers.find(
	// 			(item) => item.id.toString() === newTrip?.lead_traveller?.id?.toString()
	// 		);
	// 	}
	// 	if (oldTrip && oldTrip.state && oldTrip.state === newTrip.state) {
	// 		const key = s[getTripStoreType(oldTrip)].items.findIndex((item) => item.id === newTrip.id);
	// 		if (key >= 0) {
	// 			s[getTripStoreType(oldTrip)][key] = newTrip;
	// 		}
	// 	} else {
	// 		if (oldTrip && newTrip.state) {
	// 			s[getTripStoreType(oldTrip)].items = s[getTripStoreType(oldTrip)].items.filter(
	// 				(item) => item.id != oldTrip.id
	// 			);
	// 		}
	// 		s[getTripStoreType(newTrip)].items.push(newTrip);
	// 	}
	// 	return s;
	// });
	// return newTrip;
// };

function getTripStoreType(trip: Trip) {
	if (trip.state == TripState.new_enquiry) {
		return 'enquiry';
	}
	return trip.state;
}

// export const convertTripToInput = (trip: Trip): TRipInput => {
	// let result: TRipInput;
	// const data: any = { ...trip };
	// data.lead_traveller = trip.lead_traveller?.id;
	// data.advisor = trip.advisor?.id;
	// data.destinations = (trip.destinations || []).map((destination) => destination.id);
	// data.documents = (trip.documents || []).map((item) => item.id);
	// // data.insurance = (trip.insurance || []).map((item) => item.id);
	// data.emergencies = (trip.emergencies || []).map((item) => item.id);
	// data.travellers = (trip.travellers || []).map((item) => item.id);
	// data.tripWheres = (trip.tripWheres || []).map((item) => item.id);
	// data.experienceTypes = (trip.experienceTypes || []).map((item) => item.id + '');
	// data.travelGroupTypes = (trip.travelGroupTypes || []).map((item) => item.id + '');
	// data.lodgingTypes = (trip.lodgingTypes || []).map((item) => item.id + '');
	// data.roomStyles = (trip.roomStyles || []).map((item) => item.id + '');
	// data.currency = trip.currency?.id;
	// data.destinationTypes = (trip.destinationTypes || []).map((item) => item.id + '');
	// data.roomPreferences = (trip.roomPreferences || []).map((item) => item.id + '');
	// delete data.id;
	// delete data.updated_at;
	// delete data.__typename;
	// result = new TRipInput(data);
	// return result;
// };

export enum TripState {
	new_enquiry = 'new_enquiry',
	enquired = 'enquired',
	planning = 'planning',
	progressing = 'progressing',
	completed = 'completed',
	rejected = 'rejected',
	confirmed = 'confirmed',
	travelling = 'travelling',
	returned = 'returned',
	canceled = 'canceled'
}

export const ENUM_TRIP_STATE_LABEL = {
	new_enquiry: 'New Enquiry',
	enquired: 'Enquired',
	planning: 'Planning',
	progressing: 'Progressing',
	completed: 'Completed',
	rejected: 'Rejected',
	confirmed: 'Confirmed',
	travelling: 'Travelling',
	returned: 'Returned',
	canceled: 'Canceled'
};
