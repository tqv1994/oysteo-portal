import type { Category } from './category';

export type  RoomPreference = Category;

export const roomPreferenceFieldsFragment = `
fragment roomPreferenceFields on RoomPreference {
  id
  name
}
`;
