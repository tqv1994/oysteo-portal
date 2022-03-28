import type { Document, DocumentInput } from '$lib/store/document';
import type { Trip, TRipInput } from '$lib/store/trip';

export const updateDocumentService = async (
	id: string | number,
	input: DocumentInput
): Promise<Document> => {
	return new Promise(async (resolve, reject) => {
		const res = await fetch(`/document/update-${id}.json`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...input
			})
		});
		if (res.ok) {
			const data: Document = await res.json();
			resolve(data);
		} else {
			const error = await res.json();
			reject(error);
		}
	});
};

export const createDocumentService = async (input: DocumentInput): Promise<Document> => {
	return new Promise(async (resolve, reject) => {
		const res = await fetch(`/document/create.json`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...input
			})
		});
		if (res.ok) {
			const data: Document = await res.json();
			resolve(data);
		} else {
			const error = await res.json();
			reject(error);
		}
	});
};

export const deleteDocumentService = async (id: string | number): Promise<boolean> => {
	return new Promise(async (resolve, reject) => {
		const res = await fetch(`/document/delete-${id}.json`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (res.ok) {
			const data: Document = await res.json();
			resolve(true);
		} else {
			const error = await res.json();
			reject(error);
		}
	});
};
