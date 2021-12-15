import type { Identifiable, Nameable } from './types';

export type Experience = Identifiable &
	Nameable & {
		description: string;
	};

export const experienceFieldsFragment = `
fragment experienceFields on Experience {
    id
    name
    description
}
`;
