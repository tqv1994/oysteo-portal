import type { Metadata } from './metadata';
import type { User } from './auth';

export type Locals = {
	user?: User;
	metadata: Metadata;
};
