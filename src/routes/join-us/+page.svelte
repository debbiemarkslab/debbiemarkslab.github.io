<script>
	import photos from '#lib/data/shenanigans.json';

	const apply =
		'mailto:debbie@hms.harvard.edu?cc=jake_reardon@hms.harvard.edu&subject=' +
		encodeURIComponent('Postdoctoral position in the Marks Lab');
</script>

<svelte:head>
	<title>Join Us — Debora Marks Lab</title>
</svelte:head>

<div class="join">
	<h1 class="page-title">Join Us</h1>

	<div class="top">
		<section class="positions" aria-labelledby="positions">
			<h2 id="positions" class="section-title">Open positions</h2>
			<div class="card">
				<h3>Postdoctoral researchers</h3>
				<p>
					We are actively recruiting postdocs. Please email Debbie and cc Jake with your CV, two references and a brief
					description of your interests.
				</p>
				<p><a class="btn" href={apply}>Email</a></p>
			</div>
		</section>

		<section class="contact" aria-labelledby="contact">
			<h2 id="contact" class="section-title">Contact</h2>
			<div class="map">
				<iframe
					title="Map of 200 Longwood Avenue, Boston"
					loading="lazy"
					src="https://maps.google.com/maps?q=200+Longwood+Avenue,+Boston,+MA,+02115&z=12&output=embed"
				></iframe>
			</div>
			<div class="details">
				<div>
					<h3>Dr. Debora Marks</h3>
					<p>
						<a class="inline" href="mailto:debbie@hms.harvard.edu">debbie@hms.harvard.edu</a><br />
						Department of Systems Biology<br />Harvard Medical School
					</p>
				</div>
				<div>
					<h3>Address</h3>
					<p>Armenise 631<br />200 Longwood Avenue<br />Boston, MA 02115</p>
				</div>
				<div>
					<h3>Assistant</h3>
					<p>
						Jennie Epp<br />
						<a class="inline" href="mailto:jennie_epp@hms.harvard.edu">jennie_epp@hms.harvard.edu</a><br />
						<a class="inline" href="tel:+16174324996">(617) 432-4996</a>
					</p>
				</div>
				<div>
					<h3>Project manager</h3>
					<p>
						Jake Reardon<br />
						<a class="inline" href="mailto:jake_reardon@hms.harvard.edu">jake_reardon@hms.harvard.edu</a>
					</p>
				</div>
			</div>
		</section>
	</div>

	<section aria-labelledby="shenanigans">
		<h2 id="shenanigans" class="section-title">Shenanigans</h2>
		<div class="wall">
			{#each photos as photo (photo.src)}
				<figure>
					<img src={photo.src} alt={photo.caption ?? ''} width={photo.width} height={photo.height} loading="lazy" />
					{#if photo.caption}<figcaption>{photo.caption}</figcaption>{/if}
				</figure>
			{/each}
		</div>
	</section>
</div>

<style>
	.join {
		max-width: 1200px;
		margin: 0 auto;
		padding: 56px 40px 96px;
	}
	h3 {
		margin: 0;
		font-size: 1rem;
		line-height: 1.3;
		letter-spacing: -0.005em;
		color: var(--ink);
	}

	.top {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 48px;
		margin-top: 40px;
		align-items: start;
	}
	.card {
		padding: 24px;
		border-radius: 18px;
		background: var(--surface);
	}
	.card h3 {
		font-size: 1.125rem;
	}
	.card p {
		margin: 10px 0 0;
		line-height: 1.6;
	}
	.card p:last-child {
		margin-top: 18px;
	}

	.map {
		height: 280px;
		border-radius: 18px;
		overflow: hidden;
		background: var(--surface);
	}
	.map iframe {
		width: 100%;
		height: 100%;
		border: 0;
	}
	.details {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px 24px;
		margin-top: 20px;
		font-size: 0.9375rem;
	}
	.details p {
		margin: 4px 0 0;
		line-height: 1.55;
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

	.top + section {
		margin-top: 72px;
	}
	.wall {
		columns: 5 160px;
		column-gap: 10px;
	}
	figure {
		break-inside: avoid;
		margin: 0 0 10px;
	}
	figure img {
		width: 100%;
		height: auto;
		border-radius: 10px;
	}
	figcaption {
		padding-top: 4px;
		font-size: 0.8125rem;
		color: var(--grey);
	}

	@media (max-width: 800px) {
		.join {
			padding: 40px 16px 64px;
		}
		.top {
			grid-template-columns: 1fr;
			gap: 40px;
		}
	}
</style>
