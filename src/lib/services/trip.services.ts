import type { Trip, TRipInput } from '$lib/store/trip';

export const updateTripService = async (id: string | number, input: TRipInput): Promise<Trip> => {
	return new Promise(async (resolve, reject) => {
		const res = await fetch(`/trip/update-${id}.json`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...input
			})
		});
		if (res.ok) {
			const data: Trip = await res.json();
			resolve(data);
		} else {
			const error = await res.json();
			reject(error);
		}
	});
};

export const createTripService = async (input: TRipInput): Promise<Trip> => {
	return new Promise(async (resolve, reject) => {
		const res = await fetch(`/trip/create.json`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...input
			})
		});
		if (res.ok) {
			const data: Trip = await res.json();
			resolve(data);
		} else {
			const error = await res.json();
			reject(error);
		}
	});
};

export const getTripsService = async (params?: TRipInput): Promise<Trip[]> => {
	let paramsString = '';
	if (params) {
		paramsString = Object.keys(params)
			.map((key) => key + '=' + params[key])
			.join('&');
		paramsString = `?${paramsString}`;
	}
	return new Promise(async (resolve, reject) => {
		const res = await fetch(`/trip.json${paramsString}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (res.ok) {
			const data: Trip[] = await res.json();
			resolve(data);
		} else {
			const error = await res.json();
			reject(error);
		}
	});
};
