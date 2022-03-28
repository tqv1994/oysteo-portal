import type { Metadata } from './metadata';
import type { User } from './auth';

export type RootSessionData = {
	user?: User;
	metadata: Metadata;
};
