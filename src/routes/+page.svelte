<script>
	import news from '#lib/data/news.json';
	import { openExternalInNewTab } from '#lib/links.js';
	import DotField from '#lib/components/DotField.svelte';

	let heroText = $state(null);

	const NEWS_SHOWN = 2;
	const PHOTOS_SHOWN = 8;
	let allNews = $state(false);
	let allPhotos = $state({});
	let enlarged = $state(null); // "item-photo" key of the one photo shown at 4x, if any
	const research = [
		{
			title: 'Learning the language of life',
			text: 'Amino acids that mutate together across evolution tend to touch in 3D. We disentangle these couplings from sequence information to understand the structure and function of protein and RNA.',
			image: '/images/language_of_life_logo.svg'
		},
		{
			title: 'Genetic variation and protein design',
			text: 'Predicting the functional consequences of mutations, alone and in combination, to interpret human genetic variation and to design new sequences that stay functional and stable.',
			image: '/images/ml_logo.svg'
		},
		{
			title: 'Viral evolution and immunology',
			text: 'Using machine learning models to predict viral escape/pathogenicity, improve immune recognition, and predict antibody targets.',
			image: '/images/viral_logo.svg'
		}
	];

	const publications = [
		{ title: 'Disease variant prediction with deep generative models of evolutionary data', venue: 'Nature, 2021', href: 'https://www.nature.com/articles/s41586-021-04043-8', image: '/images/1638994910918-QG9EYFH8AL-EVE-paper-image.webp' },
		{ title: 'Inferring protein 3D structure from deep mutation scans', venue: 'Nature Genetics, 2019', href: 'https://www.nature.com/articles/s41588-019-0432-9', image: '/images/1617138093546-S4RISE0E3L-folding_dms_graphic.webp' },
		{ title: 'Deep generative models of genetic variation capture the effects of mutations', venue: 'Nature Methods, 2018', href: 'https://www.nature.com/articles/s41592-018-0138-4', image: '/images/1562700413912-ILPKLU06CZ-Deep_generative_models.webp' },
		{ title: 'Population-specific design of de-immunized protein biotherapeutics', venue: 'PLOS Computational Biology, 2018', href: 'https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1005983', image: '/images/1562701790175-6C06N5WTBO-Population-specific_design_of_de-immunized_protein_biotherapeutics.webp' },
		{ title: 'Mutation effects predicted from sequence co-variation', venue: 'Nature Biotechnology, 2017', href: 'https://www.nature.com/articles/nbt.3769', image: '/images/1562700840862-0ASKWO1FKL-Model_constraints_on_sequences.webp' },
		{ title: 'Structured states of disordered proteins from genomic sequences', venue: 'Cell, 2016', href: 'https://www.sciencedirect.com/science/article/pii/S0092867416312430', image: '/images/1562704190491-P147SES1N1-disorderPaper_cropped.webp' },
		{ title: '3D RNA and functional interactions from evolutionary couplings', venue: 'Cell, 2016', href: 'https://www.sciencedirect.com/science/article/pii/S0092867416303282', image: '/images/1562704356907-85ZEOJ6KCY-3D_RNA_and_functional_interactions_from_evolutionary_couplings.webp' }
	];

	const ext = { target: '_blank', rel: 'noopener' };
</script>

<svelte:head>
	<title>Debora Marks Lab</title>
</svelte:head>

<div class="home">
	<header class="hero">
		<DotField exclude={heroText} />
		<div class="hero-text" bind:this={heroText}>
			<h1>Debora Marks Lab</h1>
			<p class="subtitle">Machine learning to accelerate biology</p>
			<p class="lead">
				We build models to make sense of genetic variation and design biological tools for environmental and
				human health.
			</p>
		</div>
	</header>

	<section aria-labelledby="research">
		<h2 id="research" class="section-title">Research</h2>
		<div class="cards">
			{#each research as item (item.title)}
				<div class="card">
					<div class="art"><img src={item.image} alt="" loading="lazy" /></div>
					<h3>{item.title}</h3>
					<p>{item.text}</p>
				</div>
			{/each}
		</div>
	</section>

	<section aria-labelledby="highlighted">
		<h2 id="highlighted" class="section-title">Highlighted publications</h2>
		<div class="pubs">
			{#each publications as pub (pub.href)}
				<a class="pub" href={pub.href} {...ext}>
					<img src={pub.image} alt="" loading="lazy" />
					<span class="pub-title">{pub.title}</span>
					<span class="venue">{pub.venue}</span>
				</a>
			{/each}
		</div>
		<p class="actions"><a class="btn" href="/publications">View all publications</a></p>
	</section>

	<section aria-labelledby="news">
		<h2 id="news" class="section-title">News</h2>
		<ol class="news">
			{#each allNews ? news : news.slice(0, NEWS_SHOWN) as item, i (i)}
				<li>
					<p class="date">{item.date}</p>
					<h3>{item.title}</h3>
					{#each item.body as paragraph, j (j)}<p class="news-text">{@html openExternalInNewTab(paragraph)}</p>{/each}
					{#if item.video}
						<p><a class="btn tinted compact" href={item.video} {...ext}>Watch the talk</a></p>
					{/if}
					{#if item.images.length}
						<div class="thumbs">
							{#each allPhotos[i] ? item.images : item.images.slice(0, PHOTOS_SHOWN) as src, k (k)}
								<button
									class="photo"
									class:big={enlarged === `${i}-${k}`}
									aria-expanded={enlarged === `${i}-${k}`}
									aria-label={`${enlarged === `${i}-${k}` ? 'Shrink' : 'Enlarge'} photo ${k + 1}: ${item.title}`}
									onclick={() => (enlarged = enlarged === `${i}-${k}` ? null : `${i}-${k}`)}
								>
									<img {src} alt="" loading="lazy" />
								</button>
							{/each}
							{#if item.images.length > PHOTOS_SHOWN && !allPhotos[i]}
								<button class="more" onclick={() => (allPhotos[i] = true)}>
									+{item.images.length - PHOTOS_SHOWN}
									<span class="visually-hidden">more photos</span>
								</button>
							{/if}
						</div>
					{/if}
				</li>
			{/each}
		</ol>
		<p class="actions">
			<button class="btn secondary" aria-expanded={allNews} onclick={() => (allNews = !allNews)}>
				{allNews ? 'Show less' : `Show all news (${news.length - NEWS_SHOWN} more)`}
			</button>
		</p>
	</section>
</div>

<style>
	.home {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 40px 96px;
	}

	.hero {
		position: relative;
		padding: 112px 0 96px;
		text-align: center;
	}
	/* sized to the text so the dot field can keep clear of it */
	.hero-text {
		position: relative;
		width: fit-content;
		max-width: 100%;
		margin: 0 auto;
	}
	.hero h1 {
		margin: 0;
		font-size: clamp(2.5rem, 6vw, 4.25rem);
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.03em;
		color: var(--ink);
	}
	.subtitle {
		margin: 16px 0 0;
		font-size: clamp(1.25rem, 2.4vw, 1.75rem);
		line-height: 1.2;
		letter-spacing: -0.01em;
		color: var(--red);
	}
	.lead {
		max-width: 36em;
		margin: 24px auto 0;
		font-size: 1.125rem;
		line-height: 1.55;
		color: var(--grey);
	}

	section + section {
		margin-top: 96px;
	}
	.section-title {
		margin: 0 0 32px;
		font-size: 1.75rem;
		font-weight: 700;
		line-height: 1.15;
		letter-spacing: -0.02em;
		color: var(--ink);
	}

	/* research cards */
	.cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 32px;
	}
	.pub {
		display: block;
		text-decoration: none;
		color: inherit;
		-webkit-tap-highlight-color: transparent;
	}
	.art {
		display: grid;
		place-items: center;
		aspect-ratio: 4 / 3;
		padding: 28px;
		border-radius: 18px;
		background: var(--surface);
		overflow: hidden;
	}
	.art img {
		max-height: 100%;
		object-fit: contain;
		/* the sketches have opaque white backgrounds; multiply lets the grey card show through */
		mix-blend-mode: multiply;
	}
	.card h3 {
		margin: 20px 0 8px;
		font-size: 1.25rem;
		line-height: 1.25;
		letter-spacing: -0.01em;
		color: var(--ink);
	}
	.card p {
		margin: 0;
		font-size: 1rem;
		line-height: 1.55;
		color: var(--grey);
	}

	/* highlighted publications */
	.pubs {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 40px 28px;
	}
	.pub img {
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		border-radius: 14px;
		background: var(--surface);
		transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
	}
	.pub-title {
		display: block;
		margin-top: 14px;
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.3;
		letter-spacing: -0.005em;
		color: var(--ink);
	}
	.venue {
		display: block;
		margin-top: 4px;
		font-size: 0.875rem;
		color: var(--grey);
	}

	/* hover lifts the artwork; press gives immediate feedback on pointer-down */
	@media (hover: hover) {
		.pub:hover img {
			transform: scale(1.03);
		}
		.pub:hover .pub-title {
			color: var(--red);
		}
	}
	.pub:active {
		transform: scale(0.98);
		transition: transform 0.1s;
	}
	.pub {
		transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
	}

	/* news: date, headline, short text, small thumbnails */
	.news {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.news li {
		padding: 24px 0;
		border-top: 1px solid var(--rule);
	}
	.news li:first-child {
		border-top: 0;
		padding-top: 0;
	}
	.date {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--grey);
	}
	.news h3 {
		margin: 4px 0 0;
		font-size: 1.125rem;
		line-height: 1.3;
		letter-spacing: -0.01em;
		color: var(--ink);
	}
	.news-text {
		max-width: 46em;
		margin: 8px 0 0;
		font-size: 0.9375rem;
		line-height: 1.55;
	}
	.news-text :global(a) {
		text-decoration: underline;
		text-decoration-color: rgb(0 0 0 / 0.3);
	}
	.thumbs {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 12px;
	}
	.thumbs img,
	.more {
		width: 144px;
		height: 144px;
		border-radius: 10px;
		object-fit: cover;
	}
	/* photos: tap to show at 4x in place, tap again to shrink */
	.photo {
		display: block;
		padding: 0;
		border: 0;
		background: none;
		cursor: zoom-in;
		transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
	}
	.photo.big {
		cursor: zoom-out;
	}
	.photo.big img {
		width: 576px;
		max-width: 100%;
		height: auto;
		max-height: 576px;
		object-fit: contain;
		background: var(--surface);
	}
	.photo:active {
		transform: scale(0.95);
		transition-duration: 0.1s;
	}
	.more {
		border: 0;
		background: var(--surface);
		color: var(--ink);
		font: 700 0.9375rem var(--font);
		cursor: pointer;
	}
	@media (hover: hover) {
		.more:hover {
			background: #e8e8ed;
		}
	}
	button.btn {
		border: 0;
		font-family: var(--font);
		cursor: pointer;
	}

	.actions {
		margin: 48px 0 0;
		text-align: center;
	}
	@media (max-width: 800px) {
		.home {
			padding: 0 16px 64px;
		}
		.hero {
			padding: 64px 0 56px;
		}
		.cards {
			grid-template-columns: 1fr;
		}
		section + section {
			margin-top: 64px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.pub,
		.pub img,
		.photo {
			transition: none;
			transform: none !important;
		}
	}
</style>
