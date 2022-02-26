import type { Identifiable, Nameable } from "./types";
import type { UploadFile } from "./upload-file";

export type Emergency = Identifiable & {
    name: string;
    Role: string;
    phoneCode: string;
    numberPhone: string;
    reference: string;
    documents: UploadFile[];
}

export class EmergencyInput {
    name: string;
    Role: string;
    phoneCode: string;
    numberPhone: string;
    reference: string;
    documents: UploadFile[];

    constructor(values: Object = {}){
        Object.assign(this, values);
    }
}

export const convertEmergencyToInput = (emergency: Emergency): EmergencyInput => {
    // let result: EmergencyInput;
    // const data: any = {...emergency};
    // data.documents = emergency.documents.map((item)=>item.id+"");
    // delete data.id;
    // delete data.__typename;
    // result = new EmergencyInput(data);
    // return result;

    const data: any = {...emergency};
    data.documents = emergency.documents.map((item)=>item.id+"");
    delete data.id;
    delete data.__typename;
    return new EmergencyInput(data);
}

export const emergencyFieldsFragments = `
    fragment emergencyFields on Emergency{
        id
        name
        Role
        phoneCode
        numberPhone
        reference
        documents{
            ...uploadFileFields
        }
        country{
            ...countryFields
        }
    }
`

export type EmergencyTrip = Identifiable &
	Nameable & {
		name: string;
        Role: string;
        phoneCode: string;
        numberPhone: string;
        reference: string;
	};

export const advisorAgencyFieldsFragment = `
fragment emergencyTripFields on Advisor {
    id
    name
    Role
    phoneCode
    numberPhone
    reference
}
`;