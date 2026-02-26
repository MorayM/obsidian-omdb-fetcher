import {Editor, Notice} from 'obsidian';
import type {OmdbDetailResult} from '../utils/api';
import {applyTemplate} from '../utils/template';

/**
 * Applies OMDb result to the editor content (replace {=omdb:key=} placeholders).
 * Returns true if at least one placeholder was replaced; false otherwise.
 */
export function applyMovieResultToEditor(
	editor: Editor,
	result: OmdbDetailResult,
): boolean {
	const {content, replaced} = applyTemplate(editor.getValue(), result);
	if (replaced === 0) {
		new Notice('No {=omdb:...=} placeholders found in note');
		return false;
	}
	editor.setValue(content);
	new Notice(`Fetched data for "${result.Title}"`);
	return true;
}
