<script>
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

{@html data.html}
