import { meilisearchAdminApiKey, meilisearchPublicApiKey, meilisearchUrl } from '$lib/env';
import type { SvelteFetch } from '$lib/utils/fetch';
import type { Kind } from './category';
import type { Identifiable } from './types';

export const QUERY = 'q';
export const TYPE = 't';
export const COUNTRY = 'c';
export const EXPERIENCE_TYPE = 'x';
export const DESTINATION_TYPE = 'd';
export const LANGUAGE = 'lo';
export const ORDERING = 'o';
export const LIMIT = 'l';
export const PRODUCT_DESIGNER = 'pd';
export const PRODUCT_COLOUR = 'pc';
export const PRODUCT_PATTERN = 'pt';
export const VACATION_STYLE = 'vs';

export type SearchParamKey =
	| typeof QUERY
	| typeof TYPE
	| typeof COUNTRY
	| typeof EXPERIENCE_TYPE
	| typeof DESTINATION_TYPE
	| typeof LANGUAGE
	| typeof ORDERING
	| typeof LIMIT
	| typeof PRODUCT_DESIGNER
	| typeof PRODUCT_COLOUR
	| typeof PRODUCT_PATTERN
	| typeof VACATION_STYLE;

  type Filter = string | (string | string[])[];

type SearchParams = {
	offset?: number | undefined;
	limit?: number | undefined;
	attributesToRetrieve?: string[] | undefined;
	attributesToCrop?: string[] | undefined;
	cropLength?: number | undefined;
	attributesToHighlight?: string[] | undefined;
	filter?: Filter | undefined;
	sort?: string[] | undefined;
	facetsDistribution?: string[] | undefined;
	matches?: boolean | undefined;
};

export type SearchFetchParams = SearchParams & {
	q?: string | null;
};

export type OSearchParams = {
	query?: string | null;
	filter?: (string | string[])[];
	typeId?: string | null;
	types: Kind[];
};

export type SearchResult<T extends Identifiable> = {
	hasMore: boolean;
	items: T[];
};

export type SearchResultGroup<T extends Identifiable> = SearchResult<T> & {
	type?: Kind;
};

export function searchGetAll(fetch: SvelteFetch, index: string): Promise<Response> {
	return searchGet(fetch, `${meilisearchUrl}/indexes/${index}/documents?limit=999`);
}

export function searchGetOne(fetch: SvelteFetch, index: string, id: string): Promise<Response> {
	return searchGet(fetch, `${meilisearchUrl}/indexes/${index}/documents/${index}-${id}`);
}

function searchGet(fetch: SvelteFetch, url: string): Promise<Response> {
	return fetch(url, {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${meilisearchAdminApiKey}`
		}
	});
}

export function searchFetch(
	fetch: SvelteFetch,
	index: string,
	options: SearchFetchParams
): Promise<Response> {
	return fetch(`${meilisearchUrl}/indexes/${index}/search`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${meilisearchPublicApiKey}`
		},
		body: JSON.stringify(options)
	});
}
