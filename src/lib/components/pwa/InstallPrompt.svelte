<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { Download, X } from 'lucide-svelte';
	import { haptics } from '$lib/utils/haptics';
	import Button from '../ui/Button.svelte';

	let showPrompt = $state(false);
	let deferredPrompt: any = null;

	onMount(() => {
		// Verifica se já foi instalado ou já mostrou o prompt
		const hasShownPrompt = localStorage.getItem('pwa-prompt-shown');
		const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

		if (hasShownPrompt || isStandalone) {
			return;
		}

		// Escuta o evento beforeinstallprompt
		const handleBeforeInstall = (e: Event) => {
			e.preventDefault();
			deferredPrompt = e;
			
			// Aguarda 5 segundos antes de mostrar (usuário já navegou um pouco)
			setTimeout(() => {
				showPrompt = true;
			}, 5000);
		};

		window.addEventListener('beforeinstallprompt', handleBeforeInstall);

		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
		};
	});

	async function handleInstall() {
		if (!deferredPrompt) return;

		haptics.medium();
		deferredPrompt.prompt();
		
		const { outcome } = await deferredPrompt.userChoice;
		
		if (outcome === 'accepted') {
			localStorage.setItem('pwa-prompt-shown', 'true');
		}
		
		deferredPrompt = null;
		showPrompt = false;
	}

	function handleDismiss() {
		haptics.light();
		localStorage.setItem('pwa-prompt-shown', 'true');
		showPrompt = false;
	}
</script>

{#if showPrompt}
	<div class="install-prompt" transition:slide={{ duration: 300 }}>
		<button class="close-btn" onclick={handleDismiss} aria-label="Fechar">
			<X size={16} />
		</button>
		
		<div class="content">
			<div class="icon">
				<Download size={24} />
			</div>
			<div class="text">
				<strong>Instalar Monsan Map</strong>
				<p>Adicione à tela inicial para acesso rápido e modo offline</p>
			</div>
		</div>
		
		<div class="actions">
			<Button variant="ghost" onclick={handleDismiss}>Agora não</Button>
			<Button variant="primary" onclick={handleInstall}>Instalar</Button>
		</div>
	</div>
{/if}

<style>
	.install-prompt {
		position: fixed;
		bottom: calc(var(--dock-height, 60px) + var(--md));
		left: var(--xs);
		right: var(--xs);
		z-index: var(--z-toast);
		background: var(--surface);
		border-radius: var(--radius-out);
		box-shadow: var(--shadow-lg);
		padding: var(--md);
		border: 1px solid var(--border-color);

		@media (min-width: 768px) {
			left: 50%;
			transform: translateX(-50%);
			max-width: 400px;
		}
	}

	.close-btn {
		position: absolute;
		top: var(--xs);
		right: var(--xs);
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		border-radius: var(--radius-in);
		color: var(--text-secondary);
		cursor: pointer;
		transition: all var(--fast);
		padding: 0;
	}

	.close-btn:hover {
		background: var(--bg);
		color: var(--text-primary);
	}

	.content {
		display: flex;
		gap: var(--sm);
		align-items: flex-start;
		margin-bottom: var(--md);
		padding-right: var(--lg);
	}

	.icon {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--brand-primary);
		color: white;
		border-radius: var(--radius-in);
	}

	.text {
		flex: 1;
	}

	.text strong {
		display: block;
		font-size: var(--md);
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: var(--xxxs);
	}

	.text p {
		font-size: var(--sm);
		color: var(--text-secondary);
		margin: 0;
		line-height: 1.4;
	}

	.actions {
		display: flex;
		gap: var(--xs);
		justify-content: flex-end;
	}
</style>

