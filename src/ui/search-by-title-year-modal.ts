import {App, Editor, MarkdownView, Modal, Notice, Setting} from 'obsidian';
import type OmdbFetcher from '../main';
import {fetchByTitle, OmdbError} from '../utils/api';
import {applyMovieResultToEditor} from '../commands/apply-movie-result';

export class SearchByTitleYearModal extends Modal {
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
		contentEl.createEl('h2', {text: 'Fetch movie by title and year'});

		let title = '';
		let yearInput = '';

		new Setting(contentEl)
			.setName('Title')
			.addText((text) =>
				text
					.setPlaceholder('Movie title')
					.onChange((value) => {
						title = value;
					}),
			);

		new Setting(contentEl)
			.setName('Year (optional)')
			.addText((text) =>
				text
					.setPlaceholder('2010')
					.onChange((value) => {
						yearInput = value;
					}),
			);

		new Setting(contentEl).addButton((btn) =>
			btn.setButtonText('Fetch').onClick(async () => {
				const trimmedTitle = title.trim();
				if (!trimmedTitle) {
					new Notice('Enter a title');
					return;
				}
				const yearStr = yearInput.trim();
				const year = yearStr === '' ? undefined : parseInt(yearStr, 10);
				if (
					year !== undefined &&
					(Number.isNaN(year) || year < 1000 || year > 9999)
				) {
					new Notice('Year must be 4 digits');
					return;
				}

				try {
					const result = await fetchByTitle(
						this.plugin.settings.omdbApiKey,
						trimmedTitle,
						{ year, plot: this.plugin.settings.omdbPlotType },
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
