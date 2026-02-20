import {MarkdownView, Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, OmdbFetcherSettings, OmdbFetcherSettingTab} from './settings';
import {fetchMovieData} from './commands/fetch-movie-data';

export default class OmdbFetcher extends Plugin {
	settings: OmdbFetcherSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'fetch-movie-data',
			name: 'Fetch movie data',
			editorCheckCallback: (checking, editor) => {
				const view = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!view) return false;
				if (!checking) {
					void fetchMovieData(editor, view, this);
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
