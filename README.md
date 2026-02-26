# OMDb Fetcher

Fetches movie and TV data from [OMDb](https://www.omdbapi.com/) and fills placeholders in the current note. It's not designed to be a fully-featured movie library plugin, but to work alongside plugins like [QuickAdd](https://quickadd.obsidian.guide/) and [Templater](https://silentvoid13.github.io/Templater/introduction.html) which create notes, and then this plugin populates them.

## Setup

You need an OMDb API key (free at [omdbapi.com](https://www.omdbapi.com/apikey.aspx)). Set it under **Settings → Community plugins → OMDb Fetcher**. You can choose whether to fetch a short or full plot under the same settings page.

## Commands

All three commands require an active Markdown note; they replace `{=omdb:...=}` placeholders in the current page.

| Command | Behavior |
|--------|----------|
| **OMDb: Fetch movie data from filename** | Parses the note filename as `Name (Year)` and fetches by title and year. Shows a notice if the filename does not match. |
| **OMDb: Fetch movie data by title and year** | Opens a modal to enter title and optional year, then fetches and applies. |
| **OMDb: Fetch movie data by IMDb ID** | Opens a modal to enter IMDb ID (e.g. `tt0080455`), then fetches and applies. |

## Placeholders

| Placeholder | Description |
|-------------|-------------|
| `Title` | Title |
| `Year` | Year |
| `imdbID` | IMDb ID |
| `Type` | movie / series / episode |
| `Rated` | Rating (e.g. PG-13) |
| `Released` | Release date string |
| `Runtime` | e.g. "142 min" |
| `Genre` | Genre list |
| `Director` | Director(s) |
| `Writer` | Writer(s) |
| `Actors` | Cast |
| `Plot` | Plot (short or full; controlled by OMDb plot type setting) |
| `Language` | Language(s) |
| `Country` | Country/countries |
| `Awards` | Awards text |
| `Poster` | Poster URL |
| `Metascore` | Metascore |
| `imdbRating` | IMDb rating |
| `imdbVotes` | Vote count |
| `DVD` | DVD release date |
| `BoxOffice` | Box office |
| `Production` | Production company |
| `Website` | Official website URL |
| `totalSeasons` | Number of seasons (series) |
| `imdbLink` | Link to IMDb's page for this title |
| `raw` | The raw JSON response from OMDb |

If no placeholders are replaced, the plugin shows: "No {=omdb:...=} placeholders found in note".

### Examples

```txt
[{=omdb:Title=} ({=omdb:Year=})]({=omdb:imdbLink=})
```

Expands to a clickable link in your note

```txt
[The Blues Brothers (1980)](https://www.imdb.com/title/tt0080455)
```

## Privacy and network

Data is sent to OMDb only when you run a command. The plugin does not send telemetry or other data.

## Manual install

Copy `main.js`, `manifest.json` (and `styles.css` if present) into your vault's `.obsidian/plugins/obsidian-omdb-fetcher/` folder, then enable the plugin under **Settings → Community plugins**.
