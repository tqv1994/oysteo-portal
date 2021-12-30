import type { Identifiable, Nameable } from "./types";

export type Emergency = Identifiable & Nameable & {
    phone: string;
    role: string;
}

export class EmergencyInput {
    name: string;
    role: string;
    phone: string;

    constructor(values: Object = {}){
        Object.assign(this, values);
    }
}

export const convertEmergencyInput = (emergency: Emergency): EmergencyInput => {
    let result: EmergencyInput;
    const data = {...emergency};
    delete data.id;
    result = new EmergencyInput(data);
    return result;
}

export const emergencyFieldsFragments = `
    fragment emergencyFields on Emergency{
        id
        name
        role
        phone
    }
`