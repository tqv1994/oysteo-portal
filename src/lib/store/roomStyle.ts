import type { Kind } from './category';
import type { Base } from './types';
import type { UploadFile } from './upload-file';

export type RoomStyle = Base & {
	name: string;
	thumbnail: UploadFile;
	roomStyleType: Kind;
};
