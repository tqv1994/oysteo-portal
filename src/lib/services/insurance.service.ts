import type { Insurance, InsuranceInput } from '$lib/store/insurance';

export const updateInsuranceService = async (
	id: string | number,
	input: InsuranceInput
): Promise<Insurance> => {
	return new Promise(async (resolve, reject) => {
		const res = await fetch(`/insurance/update-${id}.json`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...input
			})
		});
		if (res.ok) {
			const data: Insurance = await res.json();
			resolve(data);
		} else {
			const error = await res.json();
			reject(error);
		}
	});
};

export const createInsuranceService = async (input: InsuranceInput): Promise<Insurance> => {
	return new Promise(async (resolve, reject) => {
		const res = await fetch(`/insurance/create.json`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...input
			})
		});
		if (res.ok) {
			const data: Insurance = await res.json();
			resolve(data);
		} else {
			const error = await res.json();
			reject(error);
		}
	});
};

export const deleteInsuranceService = async (id: string | number): Promise<boolean> => {
	return new Promise(async (resolve, reject) => {
		const res = await fetch(`/insurance/delete-${id}.json`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (res.ok) {
			const data: Insurance = await res.json();
			resolve(true);
		} else {
			const error = await res.json();
			reject(error);
		}
	});
};
