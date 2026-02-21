import type {OmdbDetailResult} from './api';

const PLACEHOLDER_REGEX = /\{=(\w+)=\}/g;

const EXCLUDED_KEYS = new Set(['Response']);

export interface ApplyTemplateResult {
	content: string;
	replaced: number;
}

export function applyTemplate(
	content: string,
	data: OmdbDetailResult,
): ApplyTemplateResult {
	let replaced = 0;
	const result = content.replace(PLACEHOLDER_REGEX, (match, key: string) => {
		if (EXCLUDED_KEYS.has(key)) return match;
		if (!(key in data)) return match;
		const value = (data as unknown as Record<string, unknown>)[key];
		if (typeof value !== 'string' && typeof value !== 'number') return match;
		replaced++;
		return String(value);
	});
	return {content: result, replaced};
}
