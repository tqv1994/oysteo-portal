import type { Country } from './country';
import type { Traveller } from './traveller';
import type { UploadFile } from './upload-file';

export type Identification = {
  id: number;
  created_at?: string;
  updated_at?: string;
  type: ENUM_IDENTIFICATION_TYPE;
  documentId: string;
  country: Country;
  front: UploadFile;
  expiry: string;
  traveller: Traveller;
  published_at: string;
  back: UploadFile[];
}

export enum ENUM_IDENTIFICATION_TYPE {
  national_id = "national_id",
  travel_document = "travel_document",
  driver_licence = "driver_licence",
}

export const ENUM_IDENTIFICATION_TYPE_LABEL = {
  national_id: "National ID",
  travel_document: "Travel Document",
  driver_licence: "Driver Licence",
}

export let typeOptions = [
  { key: ENUM_IDENTIFICATION_TYPE.national_id, label: ENUM_IDENTIFICATION_TYPE_LABEL.national_id },
  { key: ENUM_IDENTIFICATION_TYPE.travel_document, label: ENUM_IDENTIFICATION_TYPE_LABEL.travel_document },
  { key: ENUM_IDENTIFICATION_TYPE.driver_licence, label: ENUM_IDENTIFICATION_TYPE_LABEL.driver_licence },
];

export class IdentificationInput {
  type: ENUM_IDENTIFICATION_TYPE
  country: string // ID
  front: string // ID
  back: string[] //[ID]
  expiry: string
  traveller: string
  documentId: string

  constructor (values: Object = {}){
    Object.assign(this, values);
  }
}

export function convertIdentificationToInput(identification: Identification): IdentificationInput{
  let result: IdentificationInput;
  const data: any = {...identification};
  data.country = identification.country?.id;
  data.front = identification.front?.id;
  data.back = identification.back?.map((item)=> item.id);
  data.traveller = identification.traveller?.id || "";
  data.documentId = identification.documentId  || "";
  delete data.__typename;
  delete data.id;
  result = data;
  return result;
}



export const identificationFieldsFragment = `
fragment identificationFields on Identification {
  id,
  type,
  documentId,
  country {
      ...countryFields
  },
  front {
      ...uploadFileFields
  },
  expiry,
  back{
    ...uploadFileFields
  }
}
`;
