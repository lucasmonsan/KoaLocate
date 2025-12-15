<script lang="ts">
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	import favicon from '$lib/assets/favicon.svg';
	import Dock from '$lib/components/dock/Dock.svelte';
	import Map from '$lib/components/map/Map.svelte';
	import ToastContainer from '$lib/components/toast/ToastContainer.svelte';
	import '../app.css';
	import Main from '$lib/components/layout/Main.svelte';

	let { children } = $props();

	let showDock = $derived(page.url.pathname === '/');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1, interactive-widget=resizes-content" />
</svelte:head>

<ToastContainer />
<Map />

<Main>
	{@render children()}
</Main>

{#if showDock}
	<Dock />
{/if}
