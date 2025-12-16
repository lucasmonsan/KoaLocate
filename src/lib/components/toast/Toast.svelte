<script lang="ts">
	import type { Toast as ToastType } from '$lib/types/toast.types';
	import { fly } from 'svelte/transition';
	import { i18n } from '$lib/i18n/i18n.svelte';
	import CrossIcon from '$lib/icons/CrossIcon.svelte';
	import { slideDown } from '$lib/utils/transitions';

	interface Props {
		toast: ToastType;
		onDismiss: (id: string) => void;
	}

	let { toast, onDismiss }: Props = $props();

	const icons = {
		success: '✅',
		error: '❌',
		info: 'ℹ️',
		warning: '⚠️'
	};
</script>

<div class="toast {toast.type}" role="status" aria-live="polite" transition:slideDown>
	<span class="icon">{icons[toast.type]}</span>
	<p>{toast.message}</p>
	<button class="close" onclick={() => onDismiss(toast.id)} aria-label={i18n.t.toast.close}>
		<CrossIcon />
	</button>
</div>

<style>
	.toast {
		display: flex;
		align-items: center;
		gap: var(--xs);
		min-width: 300px;
		max-width: 500px;
		padding: var(--xs) var(--sm);
		border-radius: var(--radius-in);
		background: var(--surface);
		box-shadow: var(--shadow-lg);
		border: 2px solid transparent;
	}

	.toast.success {
		border-color: var(--success);
		background: color-mix(in srgb, var(--success) 10%, var(--surface));
	}

	.toast.error {
		border-color: var(--error);
		background: color-mix(in srgb, var(--error) 10%, var(--surface));
	}

	.toast.warning {
		border-color: var(--warning);
		background: color-mix(in srgb, var(--warning) 10%, var(--surface));
	}

	.toast.info {
		border-color: var(--brand-primary);
		background: color-mix(in srgb, var(--brand-primary) 10%, var(--surface));
	}

	.icon {
		font-size: var(--lg);
		flex-shrink: 0;
	}

	p {
		flex: 1;
		margin: 0;
		font-size: var(--sm);
		font-weight: 600;
		color: var(--text-primary);
	}

	.close {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--lg);
		height: var(--lg);
		padding: 0;
		background: transparent;
		border: none;
		border-radius: var(--radius-in);
		cursor: pointer;
		flex-shrink: 0;
		color: var(--text-secondary);
		transition: all var(--fast);
	}

	.close:hover {
		background: var(--bg);
		color: var(--text-primary);
	}

	.close:active {
		transform: scale(0.95);
	}
</style>
