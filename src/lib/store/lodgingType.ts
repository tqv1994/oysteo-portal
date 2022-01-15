import type { Category } from './category';

export type LodgingType = Category;

export const lodgingTypeFieldsFragment = `
fragment lodgingTypeFields on LodgingType {
  id
  name
}
`;
