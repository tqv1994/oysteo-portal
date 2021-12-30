import { writable } from "svelte/store";
import type { Base, CollectionStore, Nameable } from "./types"
export type InterestType = Base & Nameable & {
  interests: Interest[];
}
export type Interest = Base & Nameable & {
  type: Interest;
};

export const interestTypeStore = writable<CollectionStore<InterestType>>({
  items: {},
});

export const interestFieldsFragment = `
fragment interestFields on Interest {
  id
  name
}
`;

export const interestTypeFieldsFragment = `
fragment interestTypeFields on InterestType {
  id
  name
  interests{
    ...interestFields
  }
}
`;
