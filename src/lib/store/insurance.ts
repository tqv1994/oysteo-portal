import type { Identifiable } from './types';
import type { UploadFile } from './upload-file';

export type Insurance = Identifiable & {
	policyId: string;
	documents: UploadFile[];
	website: string;
	contact: string;
	published_at: string;
};

export class InsuranceInput {
	policyId: string;
	documents: UploadFile[];
	website: string;
	contact: string;

	constructor(values: Object = {}) {
		Object.assign(this, values);
	}
}

export const convertInsuranceToInput = (insurance: Insurance): InsuranceInput => {
	const data: any = { ...insurance };
	data.documents = insurance.documents.map((item) => item.id + '');
	delete data.id;
	delete data.published_at;
	delete data.__typename;
	return new InsuranceInput(data);
};
