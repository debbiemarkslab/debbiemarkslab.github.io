# Debora Marks Lab website

Static site for [deboramarkslab.com](https://deboramarkslab.com), built with SvelteKit.

## Editing content

Most updates are edits to a data file, no code needed:

| What | File |
| --- | --- |
| People, alumni, collaborators | `src/lib/data/people.json` |
| Publications | `src/lib/data/publications.json` |
| News (home page) | `src/lib/data/news.json` |
| MLAB journal club speakers | `src/lib/data/journal-club.json` |
| Shenanigans photos (Join Us) | `src/lib/data/shenanigans.json` |

Images go in `static/images/` and are referenced as `/images/<file>`.
Logos for the Resources page are in `static/logos/`, PDFs in `static/s/`.

## Layout

```
src/
  app.html, app.css       page shell and shared styles
  routes/                 one folder per page (+page.svelte)
    +layout.svelte        top bar and footer
    +page.svelte          home page
    [slug]/               pages rendered from src/lib/content/*.html (hidden Research page)
  lib/
    data/                 site content (JSON)
    content/              HTML content pages
    components/           DotField (animated header background)
    links.js              opens external links in a new tab
static/                   files served as-is (images, logos, PDFs)
```

## Running locally

```sh
npm install
npm run dev       # http://localhost:5173, updates live as you edit
npm run build     # writes the finished site to build/
npm run preview   # serves build/ to check it
```

`build/` is the whole site; upload its contents to any static host.
