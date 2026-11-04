import { error } from '@sveltejs/kit';
import { openExternalInNewTab } from '#lib/links.js';

// Page bodies converted from the original Squarespace site, one file per page
const pages = import.meta.glob('/src/lib/content/*.html', { query: '?raw', import: 'default', eager: true });

export function load({ params }) {
	const html = pages[`/src/lib/content/${params.slug}.html`];
	if (!html) error(404, 'Not found');
	return { html: openExternalInNewTab(html), title: html.match(/<!-- title: (.*?) -->/)?.[1] ?? 'Debbie Marks Lab' };
}

// Research (/about) is hidden from the nav but still built, so it can be brought back by re-adding the link
export function entries() {
	return Object.keys(pages).map((path) => ({ slug: path.split('/').pop().replace('.html', '') }));
}
