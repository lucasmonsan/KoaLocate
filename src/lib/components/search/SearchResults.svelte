<script>
	import { slide } from 'svelte/transition';
	import { searchState } from './search.svelte';
	import { getPlaceLabel } from '$lib/utils/osm';
</script>

{#if searchState.results.length > 0}
	<div class="results-container shadow" transition:slide={{ axis: 'y', duration: 300 }}>
		<ul>
			{#each searchState.results as result}
				<li>
					<button onclick={() => searchState.selectResult(result)}>
						<div>
							<strong>{result.properties.name}</strong>
							<small>{getPlaceLabel(result.properties)}</small>
						</div>
						{#if result.properties.city || result.properties.state}
							<span>
								{result.properties.city || result.properties.state}
								{result.properties.country && `- ${result.properties.country}`}
							</span>
						{/if}
					</button>
				</li>
			{/each}
		</ul>
	</div>
{:else if searchState.hasSearched && searchState.results.length === 0 && !searchState.loading}
	<div class="results-container shadow error" transition:slide={{ axis: 'y' }}>
		<p>Nenhum local encontrado para "<strong>{searchState.lastSearchedQuery}</strong>"</p>
	</div>
{/if}

<style>
	div {
		display: flex;
		flex-direction: column;

		&.results-container {
			width: 100%;
			max-height: 60dvh;
			overflow-y: auto;
			background: var(--surface);
			border-radius: var(--radius-out);
			padding: var(--xxs);
			margin-bottom: var(--xxs);

			&::-webkit-scrollbar {
				width: 4px;
			}
			&::-webkit-scrollbar-thumb {
				background: var(--border);
				border-radius: 4px;
			}
		}

		&.shadow {
			box-shadow: var(--shadow-lg);
		}

		&.error {
			padding: var(--sm);
			text-align: center;
			color: var(--text-secondary);
		}
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li {
		border-bottom: 1px solid var(--border);
		&:last-child {
			border-bottom: none;
		}
	}

	button {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--xs);
		background: transparent;
		border: none;
		text-align: left;
		cursor: pointer;
		transition: background var(--fast);
		border-radius: var(--radius-in);

		&:hover {
			background: var(--bg);
		}
	}

	strong {
		font-size: var(--sm);
		color: var(--text-primary);
		font-weight: 700;
	}

	small {
		font-size: var(--xs);
		color: var(--brand-primary);
		font-weight: 600;
	}

	span {
		font-size: var(--xs);
		color: var(--text-secondary);
		background: var(--bg);
		padding: 2px 6px;
		border-radius: 4px;
		white-space: nowrap;
		margin-left: var(--xs);
	}
</style>
