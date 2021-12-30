import type { Identifiable } from "./types";
import type { UploadFile } from "./upload-file";

export type Document = Identifiable & {
    type: string;
    documents: UploadFile[];
    description: string;
    created_at: string;
}

export class DocumentInput {
    type: string
    documents: string[] // ID[]
    description: string
    trip: string
    constructor(values: Object = {}){
        Object.assign(this,values);
    }
}

export const convertDocumentToInput = (document: Document): DocumentInput =>{
    const data: any = {...document};
    data.documents = document.documents.map((item)=>item.id+"");
    delete data.id;
    delete data.created_at;
    return new DocumentInput(data);
}

export enum ENUM_DOCUMENT_TYPE {
    itinerary = "itinerary",
    invoice = "invoice",
    voucher = "voucher",
    ticket = "ticket",
    passport = "passport",
    visa = "visa",
    ground_partner = "ground_partner",
    excursion = "excursion",
    transit = "transit",
    other = "other"
};

export const ENUM_DOCUMENT_TYPE_LABEL = {
    itinerary: "Itinerary",
    invoice: "Invoice",
    voucher: "Voucher",
    ticket: "Ticket",
    passport: "Passport",
    visa: "Visa",
    ground_partner: "Ground Partner",
    excursion: "Excursion",
    transit: "Transit",
    other: "Other"
}

export const docmentFieldsFragment = `
fragment documentFields on Document{
    id
    type
    documents{
        ...uploadFileFields
    }
    description
    created_at
}
`