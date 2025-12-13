<script>
	import { fade, slide } from 'svelte/transition';
	const hints = [
		'Busque pela rua, bairro, cidade, ponto turístico, empresa ou nome de comércio.',
		'O resultado desejado não apareceu? Tente ser mais específico.',
		'Rua sem numeração? Só adicionar na sua análise.'
	];
</script>

<div class="shadow" transition:fade={{ duration: 250 }}>
	<div transition:slide={{ axis: 'y' }}>
		<p>💡 Dicas de pesquisa:</p>
		<ul>
			{#each hints as hint}
				<li>{hint}</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		gap: var(--xxxs, 0.25rem);
		width: 100%;
		padding: var(--xxs, 0.5rem);
		border-radius: var(--radius-out, 1rem);
		background: var(--surface, #ffffff);

		&.shadow {
			box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06));
		}
	}

	p {
		width: 100%;
		margin: var(--xxxs, 0.25rem) 0;
		font-size: calc(var(--xs, 0.75rem) * 1.15);
		color: var(--text-secondary, #6c757d);
		text-transform: uppercase;
		font-weight: 800;
		opacity: 0.75;
	}

	ul {
		padding-left: var(--xxxs, 0.25rem);
		list-style-position: inside;
	}

	li {
		padding: var(--xxxs, 0.25rem) 0;
		margin: 0;
		font-size: calc(var(--xs, 0.75rem) * 1.1);
		font-weight: 500;
		color: var(--text-secondary, #6c757d);
	}
</style>
