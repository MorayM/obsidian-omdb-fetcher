# OMDb Fetcher

Fetches movie and TV data from [OMDb](https://www.omdbapi.com/) and fills placeholders in the current note.

## Setup

You need an OMDb API key (free at [omdbapi.com](https://www.omdbapi.com/apikey.aspx)). Set it under **Settings → Community plugins → OMDb Fetcher**.

## Commands

All three commands require an active Markdown note; they replace `{=...=}` placeholders in the current editor.

| Command | Behavior |
|--------|----------|
| **OMDb: Fetch movie data from filename** | Parses the note filename as `Name (Year)` and fetches by title and year. Shows a notice if the filename does not match. |
| **OMDb: Fetch movie data by title and year** | Opens a modal to enter title and optional year, then fetches and applies. |
| **OMDb: Fetch movie data by IMDb ID** | Opens a modal to enter IMDb ID (e.g. `tt1285016`), then fetches and applies. |

## Placeholders

Syntax: `{=key=}`. Keys come from the OMDb detail response; one synthetic key is supported.

**Synthetic placeholder**

- `{=imdbLink=}` — expands to `https://www.imdb.com/title/<imdbID>`.

**OMDb response keys** (optional fields may be missing for some titles):

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
| `Plot` | Plot (short or full per request) |
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

If no placeholders are replaced, the plugin shows: “No {=...=} placeholders found in note”.

## Privacy and network

Data is sent to OMDb only when you run a command. The plugin does not send telemetry or other data.

## Manual install

Copy `main.js`, `manifest.json` (and `styles.css` if present) into your vault’s `.obsidian/plugins/obsidian-omdb-fetcher/` folder, then enable the plugin under **Settings → Community plugins**.
