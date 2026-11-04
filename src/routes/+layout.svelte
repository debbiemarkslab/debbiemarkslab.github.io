<script>
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import '../app.css';

	let { children } = $props();
	let menuOpen = $state(false);
	afterNavigate(() => (menuOpen = false));

	const nav = [
		{ href: '/', label: 'About' },
		{ href: '/publications', label: 'Publications' },
		{ href: '/resources', label: 'Resources', sub: [{ href: '/resources#mlab', label: 'MLAB journal club' }] },
		{ href: '/people', label: 'People' },
		{ href: '/join-us', label: 'Join Us' }
		// Research (/about) is hidden for now; its page content is kept in src/lib/content/about.html
	];
</script>

<a class="skip-link" href="#main">Skip to content</a>

<header class="header">
	<a class="logo" href="/"><img src="/images/top-bar-logo.png" alt="Debbie Marks Lab" /></a>
	<button class="menu-toggle" aria-expanded={menuOpen} aria-controls="nav" onclick={() => (menuOpen = !menuOpen)}>
		<span class="visually-hidden">Menu</span><span class="bar"></span><span class="bar"></span>
	</button>
	<nav id="nav" class:open={menuOpen}>
		{#each nav as item (item.href)}
			{#if item.sub}
				<div class="has-sub">
					<a href={item.href} class:active={page.url.pathname === item.href}>{item.label}</a>
					<div class="sub">
						{#each item.sub as subItem (subItem.href)}<a href={subItem.href}>{subItem.label}</a>{/each}
					</div>
				</div>
			{:else}
				<a href={item.href} class:active={page.url.pathname === item.href}>{item.label}</a>
			{/if}
		{/each}
	</nav>
</header>

<main id="main">
	{@render children()}
</main>

<footer class="footer">
	<a href="https://github.com/debbiemarkslab" target="_blank" rel="noopener">GitHub</a>
	<a href="https://twitter.com/deboramarks" target="_blank" rel="noopener">Twitter</a>
	<span>© {new Date().getFullYear()} Marks Lab</span>
</footer>
