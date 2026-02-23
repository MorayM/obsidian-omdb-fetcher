import {Editor, MarkdownView, Notice} from 'obsidian';
import type OmdbFetcher from '../main';
import {fetchByTitle, OmdbError} from '../utils/api';
import {applyMovieResultToEditor} from './apply-movie-result';

const FILENAME_PATTERN = /^(.+)\s+\((\d{4})\)$/;

export async function fetchMovieData(editor: Editor, view: MarkdownView, plugin: OmdbFetcher): Promise<void> {
	const file = view.file;
	if (!file) {
		new Notice('No active file');
		return;
	}

	const match = file.basename.match(FILENAME_PATTERN);
	if (!match) {
		// eslint-disable-next-line obsidianmd/ui/sentence-case
		new Notice('Filename must be in the format: Name (Year)');
		return;
	}

	const title = match[1] as string;
	const year = parseInt(match[2] as string, 10);

	try {
		const result = await fetchByTitle(plugin.settings.omdbApiKey, title, {year});
		applyMovieResultToEditor(editor, result);
	} catch (err) {
		const msg = err instanceof OmdbError ? err.message : 'Unknown error fetching movie data';
		new Notice(msg);
	}
}
