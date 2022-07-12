import type { UploadFile } from './upload-file';
import type { Publishable } from './types';
import type { Advisor } from './advisor';
import type { Agency } from './agency';

export type User = Publishable & {
	username: string;
	surname: string;
	name: string;
	mobile: string;
	location?: string;
	birthday?: string;
	height?: number;
	weight?: number;
	notes?: string;
	email?: string;
	phoneNumber?: string;
	provider: string;
	confirmed: boolean;
	blocked: boolean;
	avatar: UploadFile;
	advisorMe?: string;
	agencyMe?: string;
	travellerMe?: string;
};

export type Auth = { user: User; advisorMe?: Advisor; agencyMe?: Agency };
