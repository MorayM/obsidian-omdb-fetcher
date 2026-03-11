import {App, Editor, MarkdownView, Modal, Notice, Setting} from 'obsidian';
import type OmdbFetcher from '../main';
import {fetchById, OmdbError} from '../utils/api';
import {applyMovieResultToEditor} from '../commands/apply-movie-result';

export class SearchByImdbIdModal extends Modal {
	constructor(
		app: App,
		private readonly plugin: OmdbFetcher,
		private readonly editor: Editor,
		private readonly view: MarkdownView,
	) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.empty();
		contentEl.createEl('h2', {text: 'Fetch movie by IMDb ID'});

		let imdbId = '';

		new Setting(contentEl)
			.setName('IMDb ID')
			.addText((text) =>
				text
					.setPlaceholder('For example: tt0080455')
					.onChange((value) => {
						imdbId = value;
					}),
			);

		new Setting(contentEl).addButton((btn) =>
			btn.setButtonText('Fetch').onClick(async () => {
				const trimmed = imdbId.trim();
				if (!trimmed) {
					new Notice('Enter an IMDb ID');
					return;
				}

				try {
					const result = await fetchById(
						this.plugin.settings.omdbApiKey,
						trimmed,
						{ plot: this.plugin.settings.omdbPlotType },
					);
					if (applyMovieResultToEditor(this.editor, result)) {
						this.close();
					}
				} catch (err) {
					const msg =
						err instanceof OmdbError ? err.message : 'Unknown error fetching movie data';
					new Notice(msg);
				}
			}),
		);
	}
}
