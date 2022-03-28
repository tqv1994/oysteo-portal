import type { TripWhere, TripWhereInput } from '$lib/store/tripWhere';

export const createTripWhereService = async (input: TripWhereInput): Promise<TripWhere> => {
	return new Promise(async (resolve, reject) => {
		const res = await fetch(`/trip-where/create.json`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...input,
				noNights: input.noNights ? parseInt(input.noNights + '') : 0
			})
		});
		if (res.ok) {
			const data: TripWhere = await res.json();
			resolve(data);
		} else {
			const error = await res.json();
			reject(error);
		}
	});
};

export const deleteTripWhereService = async (id: string | number): Promise<boolean> => {
	return new Promise(async (resolve, reject) => {
		const res = await fetch(`/trip-where/delete-${id}.json`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (res.ok) {
			const data: TripWhere = await res.json();
			resolve(true);
		} else {
			const error = await res.json();
			reject(error);
		}
	});
};
