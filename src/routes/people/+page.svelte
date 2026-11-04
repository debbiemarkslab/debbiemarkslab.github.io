<script>
	import people from '#lib/data/people.json';

	const ext = { target: '_blank', rel: 'noopener' };
	const linkAttrs = (href) => (href.startsWith('http') ? ext : {});

	const pi = {
		name: 'Debora S. Marks',
		title: 'Principal Investigator · Department of Systems Biology, Harvard Medical School',
		image: '/images/ae0debde-0d3b-4973-b900--Debbie_Marks_HR.webp',
		bio: 'Debora is a mathematician and computational biologist with a track record of using novel algorithms and statistics to successfully address unsolved biological problems. She has a passion for interpreting genetic variation in a way that impacts biomedical applications. During her PhD, she quantified the potential pan-genomic scope of microRNA targeting and combinatorial regulation of protein expression and co-discovered the first microRNA in a virus. As a postdoc she and her colleagues cracked the classic, unsolved problem of ab initio 3D structure prediction of proteins using a maximum entropy probability model for evolutionary sequences. She has developed this approach to determine functional interactions, biomolecular structures, including the 3D structure of RNA and RNA-protein complexes and the conformational ensembles of apparently disordered proteins. Her lab is interested in developing methods in deep learning to address a wide range of biological challenges including predicting the effects of genetic variation and sequence design for biosynthetic applications.',
		embedding:
			'Dear all, maths, biology, lipstick, chaos, Chris, bright, inspirational, sharp, chocolate, protein, RNA, nuts, caring, protease, quick wit, viruses, wine, fancy, perceptive, bioinformatics, host, talkative, stories, tlak, Jojo, indescribable, forthright, inviting, engaging, funny, sociable',
		links: [
			{ label: 'Email', href: 'mailto:debbie@hms.harvard.edu' },
			{ label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=qFmoeNkAAAAJ' },
			{ label: 'ORCID', href: 'https://orcid.org/0000-0001-9388-2281' },
			{ label: 'NIH Biosketch', href: 'https://marks.hms.harvard.edu/Marks_NIH_style_Biosketch_1.21.2019.pdf' },
			{ label: 'GitHub', href: 'https://github.com/debbiemarkslab' }
		]
	};

	// headshots: anchor near the top so hair isn't cropped; people.json can set a focus point and zoom for small faces
	const framing = (photo) =>
		photo
			? `object-position: ${photo.x * 100}% ${photo.y * 100}%; transform-origin: ${photo.x * 100}% ${photo.y * 100}%; scale: ${photo.zoom}`
			: '';

	const sections = [
		{ id: 'members', label: 'Members' },
		{ id: 'alumni', label: 'Alumni' },
		{ id: 'collaborators', label: 'Collaborators' }
	];
</script>

{#snippet linkButtons(links, name)}
	<p class="links">
		{#each links as link (link.href)}
			{#if link.label === 'Email'}
				<a class="btn tinted compact icon" href={link.href} aria-label="Email {name}" title="Email">
					<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
						<rect x="3" y="5.5" width="18" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8" />
						<path d="m4 7.5 8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</a>
			{:else}
				<a class="btn tinted compact" href={link.href} {...linkAttrs(link.href)}>{link.label}</a>
			{/if}
		{/each}
	</p>
{/snippet}

<svelte:head>
	<title>People — Debora Marks Lab</title>
</svelte:head>

<div class="people">
	<h1 class="page-title">People</h1>
	<p class="jump">
		{#each sections as s (s.id)}
			<a class="btn secondary compact" href="#{s.id}">{s.label}</a>
		{/each}
	</p>

	<section class="pi" aria-label="Principal investigator">
		<img class="pi-photo" src={pi.image} alt={pi.name} />
		<div>
			<h2 class="pi-name">{pi.name}</h2>
			<p class="pi-title">{pi.title}</p>
			{@render linkButtons(pi.links, pi.name)}
			<p>{pi.bio}</p>
			<p class="embedding"><span>Embedding</span> {pi.embedding}</p>
		</div>
	</section>

	<section id="members">
		{#each people.groups as group (group.role)}
			<h2 class="section-title">{group.role}</h2>
			{#each group.people as person (person.name)}
				<article class="person">
					<div class="headshot">
						<img src={person.image} alt={person.name} loading="lazy" style={framing(person.photo)} />
					</div>
					<div>
						<h3>{person.name}</h3>
						{#if person.affiliation}<p class="affiliation">{person.affiliation}</p>{/if}
						{#if person.links.length}{@render linkButtons(person.links, person.name)}{/if}
						{#each person.bio as paragraph, i (i)}<p>{@html paragraph}</p>{/each}
						{#if person.embedding}<p class="embedding"><span>Embedding</span> {person.embedding}</p>{/if}
					</div>
				</article>
			{/each}
		{/each}
	</section>

	<section id="alumni">
		<h2 class="section-title">Alumni</h2>
		<ul class="alumni">
			{#each people.alumni as alum, i (i)}
				<li><strong>{alum.name}</strong>{#if alum.affiliation}<span>{alum.affiliation}</span>{/if}</li>
			{/each}
		</ul>
	</section>

	<section id="collaborators">
		<h2 class="section-title">Collaborators</h2>
		<p>
			The Marks lab works very closely with the lab of Chris Sander. Find all our collaborators from the Sander lab at
			<a class="inline" href="http://www.sanderlab.org/#/" {...ext}>sanderlab.org</a>.
		</p>
		<ul class="collaborators">
			{#each people.collaborators as c (c.href)}
				<li><a class="inline" href={c.href} {...ext}>{c.name}</a></li>
			{/each}
		</ul>
	</section>
</div>

<style>
	.people {
		max-width: 1200px;
		margin: 0 auto;
		padding: 56px 40px 96px;
	}
	.jump {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: 20px 0 0;
	}
	section {
		scroll-margin-top: 120px;
	}

	/* PI: large photo beside name, title, bio and links */
	.pi {
		display: grid;
		grid-template-columns: minmax(200px, 320px) 1fr;
		gap: 48px;
		margin-top: 56px;
		align-items: start;
	}
	.pi-photo {
		width: 100%;
		aspect-ratio: 4 / 5;
		object-fit: cover;
		border-radius: 18px;
	}
	.pi-name {
		font-weight: 700;
		margin: 0;
		font-size: 2rem;
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--ink);
	}
	.pi-title {
		margin: 8px 0 0;
		font-style: italic;
		color: var(--grey);
	}

	.section-title {
		margin: 80px 0 8px;
	}
	#members .section-title:first-child {
		margin-top: 96px;
	}

	/* members: headshot left, text right */
	.person {
		display: grid;
		grid-template-columns: 128px 1fr;
		gap: 28px;
		padding: 28px 0;
		border-bottom: 1px solid var(--rule);
	}
	.person:last-child {
		border-bottom: 0;
	}
	.headshot {
		width: 128px;
		height: 128px;
		border-radius: 50%;
		overflow: hidden;
		background: var(--surface);
	}
	.headshot img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 15%;
	}
	.person h3 {
		margin: 0;
		font-size: 1.25rem;
		line-height: 1.25;
		letter-spacing: -0.01em;
	}
	.affiliation {
		margin: 2px 0 0;
		color: var(--red);
		font-size: 0.9375rem;
	}
	.person p:not(.affiliation),
	.pi p:not(.pi-title) {
		margin: 12px 0 0;
		max-width: 46em;
	}
	.embedding {
		font-size: 0.875rem;
		color: var(--grey);
	}
	.embedding span {
		margin-right: 4px;
		font-weight: 700;
		color: var(--ink);
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.inline {
		text-decoration: underline;
		text-decoration-color: rgb(0 0 0 / 0.3);
		text-underline-offset: 0.15em;
	}
	@media (hover: hover) {
		.inline:hover {
			color: var(--red);
			text-decoration-color: currentColor;
		}
	}

	/* alumni and collaborators: plain multi-column lists */
	.alumni,
	.collaborators {
		margin: 16px 0 0;
		padding: 0;
		list-style: none;
		columns: 3 240px;
		column-gap: 40px;
	}
	.alumni li,
	.collaborators li {
		break-inside: avoid;
		padding: 6px 0;
		line-height: 1.35;
	}
	.alumni span {
		display: block;
		font-size: 0.875rem;
		color: var(--grey);
	}

	@media (max-width: 800px) {
		.people {
			padding: 40px 16px 64px;
		}
		.pi {
			grid-template-columns: 1fr;
			gap: 24px;
		}
		.pi-photo {
			max-width: 280px;
		}
		.person {
			grid-template-columns: 72px 1fr;
			gap: 16px;
		}
		.headshot {
			width: 72px;
			height: 72px;
		}
	}
</style>
