import { writable } from "svelte/store";
import type { Base, CollectionStore, Nameable } from "./types";

export type TravelPreferenceType = Base & Nameable & {
    preferences: TravelPreference[];
};
export type TravelPreference = Base & Nameable & {
    other: string;
    type: TravelPreferenceType
}
export const travelPreferenceTypeStore = writable<CollectionStore<TravelPreferenceType>>({
    items: {},
});


export const travelPreferenceFieldsFragment = `
fragment travelPreferenceFields on TravelPreference {
    id
    name
    other
}
`;

export const travelPreferenceTypeFieldsFragment = `
fragment travelPreferenceTypeFields on TravelPreferenceType {
    id
    name
    preferences{
        ...travelPreferenceFields
    }
}
`;

export type PersonalPreferenceType = Base & Nameable & {
    preferences: PersonalPreference[];
}
export type PersonalPreference = Base & Nameable & {
    type: string;
}
export const personalPreferenceTypeStore = writable<CollectionStore<PersonalPreferenceType>>({
    items: {},
});

export const personalPreferenceFieldsFragment = `
fragment personalPreferenceFields on PersonalPreference {
    id
    name
}
`;

export const personalPreferenceTypeFieldsFragment = `
fragment personalPreferenceTypeFields on PersonalPreferenceType {
    id
    name
    preferences{
        ...personalPreferenceFields
    }
}
`;

