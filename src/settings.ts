import {App, PluginSettingTab, Setting} from "obsidian";
import OmdbFetcher from "./main";

export interface OmdbFetcherSettings {
	omdbApiKey: string;
	omdbPlotType: 'short' | 'full';
}

export const DEFAULT_SETTINGS: OmdbFetcherSettings = {
	omdbApiKey: 'default',
	omdbPlotType: 'short',
}

export class OmdbFetcherSettingTab extends PluginSettingTab {
	plugin: OmdbFetcher;

	constructor(app: App, plugin: OmdbFetcher) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('OMDb API key')
			.setDesc('Enter your OMDb API key')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.omdbApiKey)
				.onChange(async (value) => {
					this.plugin.settings.omdbApiKey = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('OMDb plot type')
			.setDesc('Short or full plot in OMDb responses.')
			.addDropdown((dropdown) =>
				dropdown
					.addOption('short', 'Short')
					.addOption('full', 'Full')
					.setValue(this.plugin.settings.omdbPlotType)
					.onChange(async (value: 'short' | 'full') => {
						this.plugin.settings.omdbPlotType = value;
						await this.plugin.saveSettings();
					}));
	}
}
