import type { Base } from './types';
import type { Advisor } from "./advisor";
import type { Destination } from "./destination";
import type { Document } from "./document";
import type { Insurance } from "./insurance";
import type { Traveller } from "./traveller";
import type { Emergency } from './emergency';
import { dateDiffInDays, formatMonthAndYear } from '$lib/helpers/datetime';
export type Trip = Base & {
    lead_traveller: Traveller;
    advisor: Advisor;
    description: string;
    note: string;
    state: string;
    reference: string;
    depart_at: string;
    return_at: string;
    destinations: Destination[];
    travellers: Traveller[];
    budget: number;
    vaccinated: boolean;
    documents: Document[];
    insurances: Insurance[];
    emergencies: Emergency[];
    emergencyName: string;
    emergencyPhone: string;
    emergencyRole: string;
    emergencyReference: string;
    updated_at: string;
}

export class TRipInput {
    lead_traveller: string // ID
    advisor: string // ID
    description: string
    note: string
    state: string
    reference: string
    depart_at: string | Date
    return_at: string | Date
    destinations: string[] // ID[]
    currency: string
    budget: number
    vaccinated: boolean
    documents: string[] // ID[]
    insurances: string[] // ID[]
    travellers: string[] // ID[]
    published_at: string | Date
    emergencyName: string;
    emergencyPhone: string;
    emergencyRole: string;
    emergencyReference: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export const convertTripToInput = (trip: Trip): TRipInput => {
    let result: TRipInput;
    const data: any = { ...trip };
    data.lead_traveller = (trip.lead_traveller?.id || '') + "";
    data.advisor = trip.advisor.id;
    data.destinations = trip.destinations?.map((destination) => destination.id);
    data.documents = trip.documents.map((item) => item.id);
    data.insurances = trip.insurances.map((item) => item.id);
    data.travellers = trip.travellers.map((item) => item.id);
    delete data.id;
    delete data.updated_at
    delete data.__typename;
    result = new TRipInput(data);
    return result;
}

export enum ENUM_TRIP_STATE{
    enquired = "enquired",
    planning = "planning",
    progressing = "progressing",
    completed = "completed",
}

export const ENUM_TRIP_STATE_LABEL = {
    enquired: "Enquired",
    planning: "Planning",
    progressing: "Progressing",
    completed: "Completed",
}

export const getDatesTrip = (trip: Trip): string => {
    return `${dateDiffInDays(trip.depart_at, trip.return_at)} nights, ${formatMonthAndYear(trip.depart_at)}, ${formatMonthAndYear(trip.return_at)}`;
}

export const getTravellersString = (trip: Trip): string => {
    let countAdult: number = 0;
    let countChildren: number = 0;
    let travellers = [...trip.travellers, trip.lead_traveller];
    travellers.map((traveller)=>{
        if(new Date().getFullYear() - new Date(traveller.birthday).getFullYear() >= 15){
            countAdult += 1;
        }else{
            countChildren +=1;
        }
    });
    return `${countAdult} adults, ${countChildren} children`;
}

// export const tripFieldsFragment = `
// fragment tripFields on Trip{
//     id
//     lead_traveller{
//         ...travellerFields
//     }
//     advisor{
//        id
//        name
//     }
//     description
//     note
//     state
//     reference
//     depart_at
//     return_at
//     destinations{
//         ...destinationFields
//     }
//     travellers{
//         ...travellerFields
//     }
//     documents{
//         ...documentFields
//     }
//     insurances{
//         ...insuranceFields
//     }
//     budget
//     vaccinated
//     emergencies{
//         ...emergencyFields
//     }
// }
// `;
export const tripFieldsFragment = `
fragment tripFields on Trip{
    id
    lead_traveller{
        ...travellerFields
    }
    advisor{
       id
       name
    }
    description
    note
    state
    reference
    depart_at
    return_at
    destinations{
        ...destinationFields
    }
    travellers{
        ...travellerFields
    }
    documents{
        ...documentFields
    }
    insurances{
        ...insuranceFields
    }
    budget
    vaccinated
    emergencyName
    emergencyPhone
    emergencyRole
    emergencyReference
    updated_at
}
`;