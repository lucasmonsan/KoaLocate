<script lang="ts">
	import type { PinWithCategory } from '$lib/types/database.types';
	import { i18n } from '$lib/i18n/i18n.svelte';

	let { pin, onclick } = $props<{
		pin: PinWithCategory;
		onclick?: () => void;
	}>();

	function getCategoryName() {
		return i18n.t.categories[pin.category.name] || pin.category.name;
	}
</script>

<button
	class="pin-marker"
	style="--color: {pin.category.color}"
	onclick={onclick}
	aria-label={`Pin: ${pin.name}`}
>
	<span class="icon">{pin.category.icon}</span>
	<span class="label">{pin.name}</span>
</button>

<style>
	.pin-marker {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--gap-1);
		background-color: var(--color);
		color: white;
		border: 2px solid white;
		border-radius: var(--radius-2);
		padding: var(--xs) var(--sm);
		font-size: var(--font-size-sm);
		font-weight: 600;
		box-shadow: var(--shadow-1);
		cursor: pointer;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
		white-space: nowrap;
	}

	.pin-marker:hover {
		transform: scale(1.05);
		box-shadow: var(--shadow-2);
	}

	.icon {
		font-size: var(--font-size-lg);
	}

	.label {
		max-width: 150px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	@media (max-width: 640px) {
		.label {
			max-width: 100px;
		}
	}
</style>

