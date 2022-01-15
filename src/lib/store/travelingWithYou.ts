import type { Category } from './category';

export type TravelingWithYou = Category;

export const travelingWithYouFieldsFragment = `
fragment travelingWithYouFields on TravelingWithYou {
  id
  name
}
`;
