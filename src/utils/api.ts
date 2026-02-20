import { requestUrl } from 'obsidian';

const OMDB_BASE_URL = 'https://www.omdbapi.com/';

// ---------------------------------------------------------------------------
// Request option types
// ---------------------------------------------------------------------------

export type OmdbMediaType = 'movie' | 'series' | 'episode';
export type OmdbPlotLength = 'short' | 'full';

export interface OmdbCommonOptions {
	type?: OmdbMediaType;
	plot?: OmdbPlotLength;
}

export interface OmdbFetchByTitleOptions extends OmdbCommonOptions {
	year?: number;
}

export interface OmdbSearchOptions extends OmdbCommonOptions {
	/** 1-based page number. Defaults to 1. */
	page?: number;
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

/** A single entry returned inside a search-list response. */
export interface OmdbSearchEntry {
	Title: string;
	Year: string;
	imdbID: string;
	Type: string;
	Poster: string;
}

/** Full detail for a single movie, series, or episode. */
export interface OmdbDetailResult {
	Response: 'True';
	Title: string;
	Year: string;
	imdbID: string;
	Type: string;
	Rated?: string;
	Released?: string;
	Runtime?: string;
	Genre?: string;
	Director?: string;
	Writer?: string;
	Actors?: string;
	Plot?: string;
	Language?: string;
	Country?: string;
	Awards?: string;
	Poster?: string;
	Metascore?: string;
	imdbRating?: string;
	imdbVotes?: string;
	DVD?: string;
	BoxOffice?: string;
	Production?: string;
	Website?: string;
	totalSeasons?: string;
}

/** Paginated list returned by a title-search query. */
export interface OmdbSearchResult {
	Response: 'True';
	Search: OmdbSearchEntry[];
	/** Total number of matches as a numeric string. */
	totalResults: string;
}

/** Internal shape returned by the API when a query fails. */
interface OmdbApiErrorPayload {
	Response: 'False';
	Error: string;
}

// ---------------------------------------------------------------------------
// Error class
// ---------------------------------------------------------------------------

export type OmdbErrorKind =
	| 'network'  // requestUrl threw — offline, DNS failure, etc.
	| 'http'     // Non-2xx HTTP status
	| 'api'      // 2xx response but OMDb returned Response: "False"
	| 'parse';   // 2xx response but body was not valid JSON

export class OmdbError extends Error {
	readonly kind: OmdbErrorKind;
	/** Set when kind === 'http'. */
	readonly httpStatus?: number;
	/** The Error field from OMDb. Set when kind === 'api'. */
	readonly apiMessage?: string;

	constructor(
		kind: OmdbErrorKind,
		message: string,
		options?: { httpStatus?: number; apiMessage?: string },
	) {
		super(message);
		this.name = 'OmdbError';
		this.kind = kind;
		this.httpStatus = options?.httpStatus;
		this.apiMessage = options?.apiMessage;
	}
}

// ---------------------------------------------------------------------------
// Internal: URL builder
// ---------------------------------------------------------------------------

function buildUrl(
	apiKey: string,
	params: Record<string, string | number | undefined>,
): URL {
	const url = new URL(OMDB_BASE_URL);
	url.searchParams.set('apikey', apiKey);
	url.searchParams.set('r', 'json');

	// Object.entries is ES2017; tsconfig lib only includes up to ES7 (ES2016).
	// Use Object.keys (ES5) + bracket access instead.
	const keys = Object.keys(params);
	for (const key of keys) {
		const value = params[key];
		if (value !== undefined) {
			url.searchParams.set(key, String(value));
		}
	}

	return url;
}

// ---------------------------------------------------------------------------
// Internal: request executor
// ---------------------------------------------------------------------------

async function executeRequest(url: URL): Promise<unknown> {
	let response;
	try {
		response = await requestUrl({ url: url.toString(), throw: false });
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Network error';
		throw new OmdbError('network', message);
	}

	if (response.status >= 400) {
		throw new OmdbError(
			'http',
			`OMDb returned HTTP ${response.status}`,
			{ httpStatus: response.status },
		);
	}

	// response.json is a pre-parsed property, not a method.
	const body: unknown = response.json as unknown;
	if (body == null) {
		throw new OmdbError('parse', 'OMDb response was not valid JSON');
	}

	return body;
}

// ---------------------------------------------------------------------------
// Internal: type guards
// ---------------------------------------------------------------------------

function isApiError(body: unknown): body is OmdbApiErrorPayload {
	if (typeof body !== 'object' || body === null) return false;
	const obj = body as Record<string, unknown>;
	return obj['Response'] === 'False' && typeof obj['Error'] === 'string';
}

function isDetailResult(body: unknown): body is OmdbDetailResult {
	if (typeof body !== 'object' || body === null) return false;
	const obj = body as Record<string, unknown>;
	return obj['Response'] === 'True' && typeof obj['imdbID'] === 'string';
}

function isSearchResult(body: unknown): body is OmdbSearchResult {
	if (typeof body !== 'object' || body === null) return false;
	const obj = body as Record<string, unknown>;
	return obj['Response'] === 'True' && Array.isArray(obj['Search']);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch full details for a single title by name, with an optional year.
 *
 * @throws {OmdbError} On network failure, HTTP error, API error, or unparseable response.
 */
export async function fetchByTitle(
	apiKey: string,
	title: string,
	options: OmdbFetchByTitleOptions = {},
): Promise<OmdbDetailResult> {
	const { year, type, plot } = options;
	const url = buildUrl(apiKey, { t: title, y: year, type, plot });
	const body = await executeRequest(url);

	if (isApiError(body)) {
		throw new OmdbError('api', body.Error, { apiMessage: body.Error });
	}
	if (isDetailResult(body)) {
		return body;
	}
	throw new OmdbError('parse', 'Unexpected response shape from OMDb');
}

/**
 * Fetch full details for a single title by its IMDb ID (e.g. `"tt1285016"`).
 *
 * @throws {OmdbError} On network failure, HTTP error, API error, or unparseable response.
 */
export async function fetchById(
	apiKey: string,
	imdbId: string,
	options: OmdbCommonOptions = {},
): Promise<OmdbDetailResult> {
	const { type, plot } = options;
	const url = buildUrl(apiKey, { i: imdbId, type, plot });
	const body = await executeRequest(url);

	if (isApiError(body)) {
		throw new OmdbError('api', body.Error, { apiMessage: body.Error });
	}
	if (isDetailResult(body)) {
		return body;
	}
	throw new OmdbError('parse', 'Unexpected response shape from OMDb');
}

/**
 * Search for titles matching a query string. Returns a paginated list.
 *
 * @throws {OmdbError} On network failure, HTTP error, API error, or unparseable response.
 */
export async function searchByTitle(
	apiKey: string,
	query: string,
	options: OmdbSearchOptions = {},
): Promise<OmdbSearchResult> {
	const { type, plot, page } = options;
	const url = buildUrl(apiKey, { s: query, type, plot, page });
	const body = await executeRequest(url);

	if (isApiError(body)) {
		throw new OmdbError('api', body.Error, { apiMessage: body.Error });
	}
	if (isSearchResult(body)) {
		return body;
	}
	throw new OmdbError('parse', 'Unexpected response shape from OMDb');
}
