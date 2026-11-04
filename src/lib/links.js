/** Links to other sites open in a new tab, replacing any target the old site set. */
export function openExternalInNewTab(html) {
	return html.replace(/<a\b[^>]*>/g, (tag) =>
		/\shref="https?:/.test(tag)
			? tag.replace(/\s(target|rel)="[^"]*"/g, '').replace(/^<a/, '<a target="_blank" rel="noopener"')
			: tag
	);
}
