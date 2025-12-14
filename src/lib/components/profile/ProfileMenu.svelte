<script lang="ts">
	import { slide } from 'svelte/transition';
	import { i18n } from '$lib/i18n/index.svelte';
	import type { Locale } from '$lib/i18n/types';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	let { isOpen, onClose }: Props = $props();

	const themes = [
		{ value: 'light', label: '☀️ Light' },
		{ value: 'auto', label: '💻 Auto' },
		{ value: 'dark', label: '🌙 Dark' }
	];

	const languages: { value: Locale; label: string; flag: string }[] = [
		{ value: 'pt-BR', label: 'Português', flag: '🇧🇷' },
		{ value: 'en-US', label: 'English', flag: '🇺🇸' }
	];

	let currentTheme = $state<string>('auto');

	function setTheme(theme: string) {
		currentTheme = theme;
		if (theme === 'light') {
			document.documentElement.setAttribute('data-theme', 'light');
		} else if (theme === 'dark') {
			document.documentElement.setAttribute('data-theme', 'dark');
		} else {
			document.documentElement.removeAttribute('data-theme');
		}
	}

	function setLanguage(locale: Locale) {
		i18n.setLocale(locale);
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.profile-menu') && !target.closest('[aria-label*="erfil"]')) {
			onClose();
		}
	}

	$effect(() => {
		if (isOpen) {
			setTimeout(() => {
				document.addEventListener('click', handleClickOutside);
			}, 10);

			return () => document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

{#if isOpen}
	<div class="profile-menu shadow" transition:slide={{ axis: 'y' }}>
		<section>
			<h6>🌙 Tema</h6>
			<div class="options">
				{#each themes as theme}
					<button class="option" class:active={currentTheme === theme.value} onclick={() => setTheme(theme.value)}>
						{theme.label}
					</button>
				{/each}
			</div>
		</section>

		<section>
			<h6>🌐 Idioma</h6>
			<div class="options">
				{#each languages as lang}
					<button class="option" class:active={i18n.locale === lang.value} onclick={() => setLanguage(lang.value)}>
						{lang.flag}
						{lang.label}
					</button>
				{/each}
			</div>
		</section>

		<div class="separator"></div>

		<section>
			<a href="https://github.com/lucasmonsan/localista" target="_blank" rel="noopener noreferrer"> ℹ️ Sobre </a>
		</section>
	</div>
{/if}

<style>
	.profile-menu {
		width: 100%;
		background: var(--surface);
		border-radius: var(--radius-out);
		padding: var(--xs);
		margin-bottom: var(--xxs);
		display: flex;
		flex-direction: column;
		gap: var(--xs);
	}

	.shadow {
		box-shadow: var(--shadow-lg);
	}

	section {
		display: flex;
		flex-direction: column;
		gap: var(--xxs);
	}

	h6 {
		padding: 0 var(--xxs);
		color: var(--text-secondary);
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: var(--xxxs);
	}

	.option {
		width: 100%;
		padding: var(--xxs) var(--xs);
		text-align: left;
		background: transparent;
		border: none;
		border-radius: var(--radius-in);
		cursor: pointer;
		font-size: var(--sm);
		font-weight: 600;
		color: var(--text-primary);
		transition: background var(--fast);

		&:hover {
			background: var(--bg);
		}

		&.active {
			background: var(--brand-primary);
			color: var(--surface);
		}
	}

	.separator {
		height: 1px;
		background: var(--border);
	}

	a {
		display: block;
		padding: var(--xxs) var(--xs);
		font-size: var(--sm);
		font-weight: 600;
		color: var(--text-primary);
		text-decoration: none;
		border-radius: var(--radius-in);
		transition: background var(--fast);

		&:hover {
			background: var(--bg);
		}
	}
</style>
