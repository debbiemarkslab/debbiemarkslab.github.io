<script>
	import jc from '#lib/data/journal-club.json';

	const ext = { target: '_blank', rel: 'noopener' };

	const tools = [
		{
			name: 'evedesign',
			type: 'Application',
			logo: '/logos/evedesign.svg',
			text: 'Accessible biosequence design with a unified framework.',
			cite: 'Hopf et al., bioRxiv (2026)',
			links: [
				{ label: 'evedesign.bio', href: 'https://evedesign.bio' },
				{ label: 'Paper', href: 'https://www.biorxiv.org/content/10.64898/2026.03.17.712115v1' }
			]
		},
		{
			name: 'ProteinGym',
			type: 'Benchmark',
			logo: '/logos/ProteinGym.png',
			text: 'Large-scale benchmarks for protein fitness prediction and design.',
			cite: 'Notin et al., NeurIPS (2023)',
			links: [
				{ label: 'proteingym.org', href: 'https://proteingym.org' },
				{ label: 'Paper', href: 'https://papers.nips.cc/paper_files/paper/2023/hash/cac723e5ff29f65e3fcbb0739ae91bee-Abstract-Datasets_and_Benchmarks.html' },
				{ label: 'Code', href: 'https://github.com/OATML-Markslab/ProteinGym' }
			]
		},
		{
			name: 'RNAGym',
			type: 'Benchmark',
			logo: '/logos/RNAgym.png',
			text: 'Large-scale benchmarks for RNA fitness and structure prediction.',
			cite: 'Arora et al., bioRxiv (2025)',
			links: [
				{ label: 'rnagym.org', href: 'https://rnagym.org' },
				{ label: 'Paper', href: 'https://www.biorxiv.org/content/10.1101/2025.06.16.660049' }
			]
		},
		{
			name: 'EVcouplings',
			type: 'Application',
			logo: '/logos/evcouplings.png',
			text: 'Predict evolutionary couplings, 3D structures and mutation effects from sequence alignments.',
			cite: 'Hopf et al., Bioinformatics (2019)',
			links: [
				{ label: 'evcouplings.org', href: 'https://evcouplings.org' },
				{ label: 'Paper', href: 'https://academic.oup.com/bioinformatics/article/35/9/1582/5124274' },
				{ label: 'Code', href: 'https://github.com/debbiemarkslab/EVcouplings' }
			]
		},
		{
			name: 'Marks Lab on GitHub',
			type: 'Code',
			logo: '/logos/github-debbiemarkslab.png',
			text: 'Source code for the lab’s models, benchmarks and analyses.',
			links: [
				{ label: 'debbiemarkslab', href: 'https://github.com/debbiemarkslab' },
				{ label: 'OATML-Markslab', href: 'https://github.com/OATML-Markslab' }
			]
		}
	];

	const earlier = [
		{ name: 'microRNA.org', text: 'Predicted microRNA targets and target downregulation scores, with experimentally observed expression patterns.', href: 'http://www.microrna.org/microrna/home.do' },
		{ name: 'Transmembrane protein 3D structures', text: 'Predicted structures for alpha-helical transmembrane proteins of unknown structure.', href: 'https://marks.hms.harvard.edu/tmproteins/tmp_index.html' },
		{ name: 'Brain-expressed protein 3D structures', text: 'Predicted 3D structures of brain-expressed proteins.', href: 'https://marks.hms.harvard.edu/neuroproteins/index.html' }
	];

	// MIA = the Models, Inference & Algorithms seminar at the Broad Institute
	const talks = [
		{ title: 'Building and evaluating generative models of biological sequences, from proteins to whole genomes', speaker: 'Eli Weinstein', year: 2021, where: 'MIA, Broad Institute', href: 'https://www.youtube.com/watch?v=bR8Ct75w3YE&t=2737s', thumb: '/images/1631646364346-MJ7WVKU4UP-Screen-Shot-2021-09-14-at-3.05.50-PM.webp' },
		{ title: 'Estimation and testing with generative nonparametric Bayesian models', speaker: 'Alan Amin', year: 2021, where: 'MIA, Broad Institute', href: 'https://www.youtube.com/watch?v=bR8Ct75w3YE', thumb: '/images/1631645790674-4QV4MJEELA-Screen-Shot-2021-09-14-at-2.56.08-PM.webp' },
		{ title: 'Generative models of antibodies for functionally optimized library design', speaker: 'Jung-Eun (June) Shin', year: 2021, where: 'MIA, Broad Institute', href: 'https://youtu.be/KVzm0jN7Kfk', thumb: '/images/1617137410146-8Q2OFCH1W6-MIA_2021-June.webp' },
		{ title: 'Large-scale clinical interpretation of genetic variants using evolutionary data and deep learning', speaker: 'Jonathan Frazer & Mafalda Dias', year: 2021, where: 'MIA, Broad Institute', href: 'https://youtu.be/KVzm0jN7Kfk?t=2843', thumb: '/images/1617137409682-G4PI4A7FKX-MIA_2021-Jonny_Mafalda.webp' },
		{ title: 'EVcouplings: using evolution to determine structure and function', speaker: 'Thomas Hopf & Kelly Brock', year: 2020, where: null, href: 'https://youtu.be/33UFgZpSFdE?t=146', thumb: '/images/1617137406583-4T3XTUWPRN-2020_Kelly_Thomas.webp' },
		{ title: 'Generative models from NLP for sequence data', speaker: 'Aaron Kollasch', year: 2019, where: 'MIA, Broad Institute', href: 'https://youtu.be/GUt9NQcll5c', thumb: '/images/1617137408054-MY1LWJBRA0-MIA_2019_Aaron.webp' },
		{ title: 'Alignment-free models for protein and antibody design', speaker: 'Debora Marks', year: 2019, where: 'MIA, Broad Institute', href: 'https://youtu.be/GUt9NQcll5c?t=2742', thumb: '/images/1617137408306-SKHAO2P59G-MIA_2019_Debbie.webp' },
		{ title: 'Learning protein structure with a differentiable simulator', speaker: 'John Ingraham', year: 2018, where: 'MIA, Broad Institute', href: 'https://youtu.be/R20_s8XPw8U', thumb: '/images/1617137407596-FCNYAYMLJT-MIA_2018_John.webp' },
		{ title: 'Generative models of biological sequence families', speaker: 'John Ingraham & Adam Riesselman', year: 2017, where: 'MIA, Broad Institute', href: 'https://youtu.be/97q2wtoquQk', thumb: '/images/1617137407378-CYFX6QMP69-MIA_2017-John_Adam.webp' },
		{ title: 'Structure and fitness from genomic sequences', speaker: 'Debora Marks', year: 2017, where: 'MIA, Broad Institute', href: 'https://youtu.be/97q2wtoquQk?t=3092', thumb: '/images/1617137406784-Z8E2DXA2X7-MIA_2017_Debbie.webp' }
	];
</script>

<svelte:head>
	<title>Resources — Debora Marks Lab</title>
</svelte:head>

<div class="resources">
	<header class="intro">
		<h1 class="page-title">Resources</h1>
	</header>

	<ul class="tools">
		{#each tools as tool (tool.name)}
			<li class="tool">
				<div class="logo"><img src={tool.logo} alt="" /></div>
				<div>
					<p class="kicker">{tool.type}</p>
					<h2>{tool.name}</h2>
					<p class="text">{tool.text}</p>
					{#if tool.cite}<p class="cite">{tool.cite}</p>{/if}
					<p class="links">
						{#each tool.links as link (link.href)}
							<a class="btn tinted compact" href={link.href} {...ext}>{link.label}</a>
						{/each}
					</p>
				</div>
			</li>
		{/each}
	</ul>

	<section aria-labelledby="journal-club" id="mlab">
		<h2 id="journal-club" class="section-title">MLAB journal club</h2>
		<p class="text">
			Machine Learning to Accelerate Biology (MLAB) is our open seminar series. Speakers present statistical and
			machine learning methods that solve, or could solve, biological problems, from protein design and structure to
			single-cell, whole-genome modeling and viral evolution. Talks are informal and questions are encouraged.
		</p>
		<p class="links">
			<a class="btn tinted compact" href={jc.signup} {...ext}>Join the mailing list</a>
			<a class="btn tinted compact" href="mailto:assistant.markslab@gmail.com">Request to present</a>
		</p>

		{#if jc.upcoming.length}
		<details class="speakers">
			<summary>Upcoming speakers <span>{jc.upcoming.length}</span></summary>
			<ul>
				{#each jc.upcoming as s, i (i)}<li><span class="date">{s.date}</span>{s.speaker}</li>{/each}
			</ul>
		</details>
		{/if}
		<details class="speakers">
			<summary>Past speakers <span>{jc.past.length}</span></summary>
			<ul>
				{#each jc.past as s, i (i)}<li><span class="date">{s.date}</span>{s.speaker}</li>{/each}
			</ul>
			<p class="slides">
				Slides: <a href="/s/TDS-talk-Luhuan-Wu-April-2024.pdf" {...ext}>Twisted diffusion sampler for controllable generation with application to motif-scaffolding</a>
				(Luhuan Wu, April 2024)
			</p>
		</details>
	</section>

	<section aria-labelledby="talks">
		<h2 id="talks" class="section-title">Talks</h2>
		<ul class="talks">
			{#each talks as talk (talk.href)}
				<li class="talk">
					<a class="thumb" href={talk.href} {...ext} tabindex="-1" aria-hidden="true"><img src={talk.thumb} alt="" loading="lazy" /></a>
					<div>
						<h3>{talk.title}</h3>
						<p class="cite">{[talk.speaker, talk.year, talk.where].filter(Boolean).join(' · ')}</p>
						<p class="links"><a class="btn tinted compact" href={talk.href} {...ext}>Watch on YouTube</a></p>
					</div>
				</li>
			{/each}
		</ul>
	</section>

	<section aria-labelledby="earlier">
		<h2 id="earlier" class="section-title">Earlier resources</h2>
		<ul class="plain">
			{#each earlier as r (r.href)}
				<li><a class="name" href={r.href} {...ext}>{r.name}</a><span>{r.text}</span></li>
			{/each}
		</ul>
	</section>
</div>

<style>
	.resources {
		max-width: 1000px;
		margin: 0 auto;
		padding: 56px 40px 96px;
	}
	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* maintained resources: logo tile beside name, description, citation and links */
	.tools {
		margin-top: 40px;
	}
	.tool,
	.talk {
		display: grid;
		grid-template-columns: 112px 1fr;
		gap: 24px;
		padding: 24px 0;
		border-top: 1px solid var(--rule);
	}
	.logo {
		display: grid;
		place-items: center;
		width: 112px;
		height: 112px;
		padding: 12px;
		border-radius: 22px;
		background: var(--surface);
	}
	.logo img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}
	.kicker {
		margin: 0;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--red);
	}
	.tool h2 {
		margin: 2px 0 0;
		font-size: 1.25rem;
		font-weight: 700;
		line-height: 1.25;
		letter-spacing: -0.01em;
		color: var(--ink);
	}
	.text {
		max-width: 44em;
		margin: 6px 0 0;
		font-size: 0.9375rem;
		line-height: 1.55;
	}
	.cite {
		margin: 4px 0 0;
		font-size: 0.8125rem;
		color: var(--grey);
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: 12px 0 0;
	}

	.section-title {
		margin: 72px 0 16px;
	}
	.plain li {
		padding: 10px 0;
		border-top: 1px solid var(--rule);
		font-size: 0.9375rem;
	}
	.plain .name {
		display: block;
		font-weight: 700;
		color: var(--ink);
		text-decoration: none;
	}
	@media (hover: hover) {
		.plain .name:hover {
			color: var(--red);
		}
	}
	.plain span {
		font-size: 0.875rem;
		color: var(--grey);
	}

	/* journal club speaker lists: collapsed by default */
	.speakers {
		margin-top: 12px;
		border-radius: 14px;
		background: var(--surface);
	}
	.speakers summary {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 12px 16px;
		font-weight: 700;
		cursor: pointer;
		list-style: none;
	}
	.speakers summary::-webkit-details-marker {
		display: none;
	}
	.speakers summary::after {
		content: '';
		width: 7px;
		height: 7px;
		margin-left: auto;
		border-right: 2px solid var(--grey);
		border-bottom: 2px solid var(--grey);
		transform: rotate(45deg);
		transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
	}
	.speakers[open] summary::after {
		transform: rotate(-135deg);
	}
	.speakers summary span {
		font-weight: 400;
		font-size: 0.8125rem;
		color: var(--grey);
	}
	.speakers ul {
		max-height: 420px;
		overflow-y: auto;
		padding: 0 16px 12px;
	}
	.speakers li {
		display: grid;
		grid-template-columns: 96px 1fr;
		gap: 12px;
		padding: 6px 0;
		border-top: 1px solid #e5e5ea;
		font-size: 0.875rem;
		line-height: 1.4;
	}
	.date {
		color: var(--grey);
		font-variant-numeric: tabular-nums;
	}
	.slides {
		margin: 0;
		padding: 0 16px 14px;
		font-size: 0.8125rem;
		color: var(--grey);
	}
	.slides a {
		color: var(--ink);
		text-decoration: underline;
		text-decoration-color: rgb(0 0 0 / 0.3);
	}

	/* talks: video still beside title, speaker, year and link */
	.talk {
		grid-template-columns: 160px 1fr;
	}
	.thumb img {
		width: 160px;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		border-radius: 12px;
		background: var(--surface);
	}
	.talk h3 {
		margin: 0;
		font-size: 1.0625rem;
		line-height: 1.35;
		letter-spacing: -0.005em;
		color: var(--ink);
	}

	@media (max-width: 700px) {
		.resources {
			padding: 40px 16px 64px;
		}
		.tool {
			grid-template-columns: 72px 1fr;
			gap: 16px;
		}
		.logo {
			width: 72px;
			height: 72px;
			padding: 8px;
			border-radius: 16px;
		}
		.talk {
			grid-template-columns: 96px 1fr;
			gap: 16px;
		}
		.thumb img {
			width: 96px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.speakers summary::after {
			transition: none;
		}
	}
</style>
