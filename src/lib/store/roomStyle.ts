import type { Category } from './category';
import type { Base } from './types';
import type { UploadFile } from './upload-file';

export type RoomStyle = Base & {
    name: string;
    thumbnail: UploadFile;
    roomStyleType: RoomStyleType;
};

export const roomStyleFieldsFragment = `
fragment roomStyleFields on RoomStyle {
  id
  name
  thumbnail {
      ...uploadFileFields
  }
  roomStyleType {
      ...roomStyleTypeFields
  }
}
`;

export type RoomStyleType = Category;


export const roomStyleTypeFieldsFragment = `
fragment roomStyleTypeFields on RoomStyleType {
    id
    name
  }
`;
