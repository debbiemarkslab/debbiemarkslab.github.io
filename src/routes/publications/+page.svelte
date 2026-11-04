<script>
	import publications from '#lib/data/publications.json';
	import people from '#lib/data/people.json';

	// authors are bolded when first + last name match the PI, a current member or an alumnus
	const nicknames = { dan: 'daniel', joe: 'joseph', sam: 'samuel', nikki: 'nicole' };
	const words = (name) =>
		name
			.normalize('NFD')
			.replace(/[̀-ͯ]/g, '')
			.replace(/\([^)]*\)/g, '')
			.toLowerCase()
			.match(/[a-z][a-z'-]+/g) ?? [];
	const first = (w) => nicknames[w] ?? w;

	const lab = new Set();
	for (const name of [
		'Debora Marks',
		...people.groups.flatMap((g) => g.people.map((p) => p.name)),
		...people.alumni.map((a) => a.name)
	]) {
		const w = words(name);
		// every given name counts, so "June Jung-Eun Shin" matches "Jung-Eun Shin"
		for (const given of w.slice(0, -1)) lab.add(`${first(given)} ${w.at(-1)}`);
	}
	const isLab = (author) => {
		const w = words(author);
		return w.length > 1 && lab.has(`${first(w[0])} ${w.at(-1)}`);
	};

	const years = [...new Set(publications.map((p) => p.year))];
	const byYear = years.map((year) => ({ year, pubs: publications.filter((p) => p.year === year) }));
</script>

<svelte:head>
	<title>Publications — Debora Marks Lab</title>
</svelte:head>

<div class="pubs-page">
	<header class="intro">
		<h1 class="page-title">Publications</h1>
		<p>
			<span>Lab members and alumni in <strong>bold</strong>.</span>
			<a class="btn tinted compact" href="https://scholar.google.com/citations?user=qFmoeNkAAAAJ" target="_blank" rel="noopener">
				Google Scholar
			</a>
		</p>
	</header>

	{#each byYear as group (group.year)}
		<section class="year" aria-labelledby="y{group.year}">
			<h2 id="y{group.year}">{group.year}</h2>
			<ol>
				{#each group.pubs as pub, i (i)}
					<li>
						<a class="title" href={pub.href} target="_blank" rel="noopener">{pub.title}</a>
						<p class="authors">
							{#each pub.authors as author, i (i)}{i ? ', ' : ''}{#if isLab(author)}<strong>{author}</strong>{:else}{author}{/if}{/each}
						</p>
						<p class="venue">{pub.venue}{#if pub.note}<span class="note"> · ^ {pub.note}</span>{/if}</p>
					</li>
				{/each}
			</ol>
		</section>
	{/each}
</div>

<style>
	.pubs-page {
		max-width: 1000px;
		margin: 0 auto;
		padding: 56px 40px 96px;
	}
	.intro p {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
		margin: 12px 0 0;
		font-size: 0.875rem;
		color: var(--grey);
	}
	.intro strong {
		color: var(--ink);
	}

	/* each year: label in its own column so the breaks between years are obvious */
	.year {
		display: grid;
		grid-template-columns: 96px 1fr;
		gap: 24px;
		margin-top: 40px;
		padding-top: 20px;
		border-top: 1px solid var(--rule);
	}
	.year h2 {
		position: sticky;
		top: 104px;
		align-self: start;
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		line-height: 1.3;
		letter-spacing: -0.01em;
		color: var(--red);
	}
	ol {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li + li {
		margin-top: 22px;
	}
	.title {
		font-size: 1.0625rem;
		font-weight: 700;
		line-height: 1.35;
		letter-spacing: -0.005em;
		color: var(--ink);
		text-decoration: none;
	}
	@media (hover: hover) {
		.title:hover {
			color: var(--red);
		}
	}
	.authors,
	.venue {
		margin: 4px 0 0;
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--grey);
	}
	.authors strong {
		color: var(--ink);
	}
	.venue {
		margin-top: 2px;
		font-style: italic;
	}
	.note {
		font-style: normal;
	}

	@media (max-width: 700px) {
		.pubs-page {
			padding: 40px 16px 64px;
		}
		.year {
			grid-template-columns: 1fr;
			gap: 12px;
		}
		.year h2 {
			position: static;
		}
	}
</style>
