<script lang="ts">
	import CrossIcon from '$lib/icons/CrossIcon.svelte';
	import SearchIcon from '$lib/icons/SearchIcon.svelte';
	import LoadingIcon from '$lib/icons/LoadingIcon.svelte';
	import Button from '../ui/Button.svelte';
	import { searchState } from './search.svelte';

	let inputElement: HTMLInputElement | undefined = $state();

	function handleClear() {
		searchState.clear();
		inputElement?.focus();
	}

	function handleSubmit() {
		inputElement?.blur();
		searchState.search();
	}
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		handleSubmit();
	}}
>
	<input
		bind:this={inputElement}
		type="text"
		placeholder="Pesquise no LocaLista..."
		bind:value={searchState.query}
		oninput={(e) => searchState.setQuery(e.currentTarget.value)}
		onfocus={() => (searchState.focused = true)}
		onblur={() => (searchState.focused = false)}
	/>

	<Button variant="ghost" onclick={() => searchState.query !== '' && handleClear()} type="button">
		{#if searchState.loading}
			<LoadingIcon />
		{:else if searchState.query === ''}
			<SearchIcon />
		{:else}
			<CrossIcon />
		{/if}
	</Button>
</form>

<style>
	form {
		overflow: hidden;
		display: flex;
		flex-grow: 1;
		height: var(--xxxl, 3rem);
		padding: 0 var(--xxs, 0.4rem) 0 var(--xs, 0.6rem);
		border-radius: var(--radius-out, 1rem);
		box-shadow: var(--shadow-md);
		background: var(--surface);
		transition: box-shadow var(--fast);

		&:focus-within {
			box-shadow: var(--shadow-lg);
		}
	}

	input {
		width: 100%;
		height: 100%;
		font-size: var(--sm, 0.875rem);
		font-weight: 600;
		color: var(--text-primary);
		background: transparent;
	}
</style>
