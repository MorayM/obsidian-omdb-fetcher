import {MarkdownView, Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, OmdbFetcherSettings, OmdbFetcherSettingTab} from './settings';
import {fetchMovieData} from './commands/fetch-movie-data';
import {SearchByTitleYearModal} from './ui/search-by-title-year-modal';
import {SearchByImdbIdModal} from './ui/search-by-imdb-id-modal';

export default class OmdbFetcher extends Plugin {
	settings: OmdbFetcherSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'omdb:fetch-movie-data-by-title-year-from-filename',
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			name: 'OMDb: Fetch movie data from filename',
			editorCheckCallback: (checking, editor) => {
				const view = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!view) return false;
				if (!checking) {
					void fetchMovieData(editor, view, this);
				}
				return true;
			},
		});

		this.addCommand({
			id: 'omdb:fetch-movie-data-by-title-year',
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			name: 'OMDb: Fetch movie data by title and year',
			editorCheckCallback: (checking, editor) => {
				const view = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!view) return false;
				if (!checking) {
					new SearchByTitleYearModal(this.app, this, editor, view).open();
				}
				return true;
			},
		});

		this.addCommand({
			id: 'omdb:fetch-movie-data-by-imdb-id',
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			name: 'OMDb: Fetch movie data by IMDb ID',
			editorCheckCallback: (checking, editor) => {
				const view = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!view) return false;
				if (!checking) {
					new SearchByImdbIdModal(this.app, this, editor, view).open();
				}
				return true;
			},
		});

		this.addSettingTab(new OmdbFetcherSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<OmdbFetcherSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
