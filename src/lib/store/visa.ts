import type { Country } from './country';
import type { UploadFile } from './upload-file';

export type Visa = {
    id: number;
    created_at?: string;
    updated_at?: string;
    country: Country;
    document: UploadFile;
    expiry: string;
}

export const visaFieldsFragment = `
fragment visaFields on Visa {
  id,
  document {
    ...uploadFileFields
  },
  country {
      ...countryFields
  },
  expiry
}
`;
