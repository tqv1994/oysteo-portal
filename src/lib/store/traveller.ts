import { writable } from 'svelte/store';
import type { Address } from './address';
import type { User } from './auth';
import type { Kind } from './category';
import type { Country } from './country';
import type { Destination } from './destination';
import type { Identification } from './identification';
import type { Interest } from './interest';
import type { PersonalPreference, TravelPreference } from './preference';
import type { Product } from './product';
import type { Trip } from './trip';
import type { SideNavItem } from './types';

export type Traveller = {
	id: number;
	created_at?: string;
	updated_at?: string;
	salutationType: Kind;
	forename: string;
	surname: string;
	birthday: string;
	height: number;
	weight: number;
	notes: string;
	homePhone: string;
	mobilePhone: string;
	workPhone: string;
	emergencyPhone: string;
	whatsapp: string;
	instagram: string;
	facebook: string;
	messenger: string;
	language: string;
	nationality: Country;
	residence: Country;
	email: string;
	children: Traveller;
	address: Address;
	spouse: Traveller[];
	partners: Traveller[];
	parents: Traveller[];
	relatives: Traveller[];
	friends: [Traveller];
	otherRelations: Traveller[];
	interests: Interest[];
	travelPreferences: TravelPreference[];
	personalPreferences: PersonalPreference[];
	stylePreferences: string;
	topSize: string;
	dressSize: string;
	jeanPantSize: string;
	braSize: string;
	shoeSize: string;
	bodyStyle: string;
	gender: string;
	weightUnit: string;
	heightUnit: string;
	passportNumber: string;
	passportExpiryDate: string;
	passportPlaceOfIssue: string;
	medicalCondition: string;
	destinationLikes?: Destination[];
	experienceLikes?: Kind[];
	productLikes?: Product[];
	userMe: User;
};

export type TravellerGroup = SideNavItem & {
	trips: Trip[];
};

export const travellersStore = writable<Traveller[]>([]);

export class TravellerInput {
	salutationType: string;
	forename: string;
	surname: string;
	birthday: string;
	height: number;
	weight: number;
	notes: string;
	homePhone: string;
	mobilePhone: string;
	workPhone: string;
	emergencyPhone: string;
	whatsapp: string;
	instagram: string;
	facebook: string;
	messenger: string;
	address: string;
	language: string;
	nationality: string;
	residence: string;
	visas: string[];
	identifications: string[];
	email: string;
	spouse: string[];
	partners: string[];
	parents: string[];
	children: string;
	relatives: string[];
	friends: string[];
	otherRelations: string[];
	passportNumber: string;
	passportExpiryDate: string;
	passportPlaceOfIssue: string;
	medicalCondition: string;

	constructor(values: Object = {}) {
		Object.assign(this, values);
	}
}

// export function convertTravellerToInput(traveller: Traveller): TravellerInput {
// 	let result: TravellerInput;
// 	const data: any = { ...traveller };
// 	data.salutationType = traveller.salutationType?.id;
// 	data.address = traveller.address;
// 	data.visas = traveller.visas?.map((item) => {
// 		return item.id;
// 	});
// 	data.identifications = traveller.identifications?.map((item) => {
// 		return item.id;
// 	});
// 	data.partners = traveller.partners?.map((item) => item.id);
// 	data.parents = traveller.parents?.map((item) => item.id);
// 	data.children = traveller.children?.id;
// 	data.relatives = traveller.relatives?.map((item) => item.id);
// 	data.friends = traveller.friends?.map((item) => item.id);
// 	data.spouse = traveller.spouse?.map((item) => item.id);
// 	data.otherRelations = traveller.otherRelations?.map((item) => item.id);
// 	data.nationality = traveller.nationality?.id;
// 	data.interests = traveller.interests?.map((item) => item.id);
// 	data.personalPreferences = traveller.personalPreferences?.map((item) => item.id);
// 	data.travelPreferences = traveller.travelPreferences?.map((item) => item.id);
// 	data.residence = traveller.residence?.id;
// 	delete data.__typename;
// 	delete data.id;
// 	result = data;
// 	return result;
// }

export type IdentificationWithRelationship = {
	items: Identification[];
	relationship: string;
};

export const RELATIVE_LABELS = {
	spouse: 'Spouse',
	parents: 'Parent',
	partners: 'Partner',
	relatives: 'Relative',
	otherRelatives: 'Other Relative',
	children: 'Children'
};

export const RELATIVES = {
	spouse: 'spouse',
	parents: 'parents',
	partners: 'partners',
	relatives: 'relatives',
	otherRelations: 'otherRelations',
	children: 'children'
};

// export function getAllIdentifications(traveller: Traveller): IdentificationWithRelationship[] {
// 	const result: IdentificationWithRelationship[] = [];
// 	result.push({
// 		items: traveller.identifications.map((item) => {
// 			item.traveller = traveller;
// 			return item;
// 		}),
// 		relationship: 'Me'
// 	});

// 	if (traveller.children) {
// 		result.push({
// 			items: traveller.children.identifications.map((item) => {
// 				item.traveller = traveller.children;
// 				return item;
// 			}),
// 			relationship: 'Children'
// 		});
// 	}

// 	if (traveller.spouse) {
// 		let items: Identification[] = [];
// 		for (const travellerItem of traveller.spouse) {
// 			items = items.concat(
// 				travellerItem?.identifications.map((item) => {
// 					item.traveller = travellerItem;
// 					return item;
// 				})
// 			);
// 		}
// 		result.push({ items, relationship: 'Spouse' });
// 	}

// 	if (traveller.parents) {
// 		let items: Identification[] = [];
// 		for (const travellerItem of traveller.parents) {
// 			items = items.concat(
// 				travellerItem?.identifications.map((item) => {
// 					item.traveller = travellerItem;
// 					return item;
// 				})
// 			);
// 		}
// 		result.push({ items, relationship: 'Parent' });
// 	}

// 	if (traveller.partners) {
// 		let items: Identification[] = [];
// 		for (const travellerItem of traveller.partners) {
// 			items = items.concat(
// 				travellerItem?.identifications.map((item) => {
// 					item.traveller = travellerItem;
// 					return item;
// 				})
// 			);
// 		}
// 		result.push({ items, relationship: 'Partner' });
// 	}

// 	if (traveller.relatives) {
// 		let items: Identification[] = [];
// 		for (const travellerItem of traveller.relatives) {
// 			items = items.concat(
// 				travellerItem?.identifications.map((item) => {
// 					item.traveller = travellerItem;
// 					return item;
// 				})
// 			);
// 		}
// 		result.push({ items, relationship: 'Relative' });
// 	}

// 	if (traveller.otherRelations) {
// 		let items: Identification[] = [];
// 		for (const travellerItem of traveller.otherRelations) {
// 			items = items.concat(
// 				travellerItem?.identifications.map((item) => {
// 					item.traveller = travellerItem;
// 					return item;
// 				})
// 			);
// 		}
// 		result.push({ items, relationship: 'Other Relative' });
// 	}
// 	return result;
// }