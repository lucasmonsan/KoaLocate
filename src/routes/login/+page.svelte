<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/services/supabase';
	import Button from '$lib/components/ui/Button.svelte';
	import { i18n } from '$lib/i18n/i18n.svelte'; // Import corrigido
	import { toast } from '$lib/components/toast/toast.svelte';
	import { fade } from 'svelte/transition';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);

	let t = $derived(i18n.t);

	async function handleLogin() {
		console.log('--- Início handleLogin ---');
		console.log('Email:', email);
		console.log('Senha preenchida:', !!password);

		if (!email || !password) {
			console.log('Validação falhou: campos vazios');
			toast.error(t.auth?.errors.generic || 'Erro genérico');
			return;
		}

		loading = true;
		console.log('Chamando supabase.auth.signInWithPassword...');

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		console.log('Supabase respondeu:', { data, error });
		loading = false;

		if (error) {
			console.error('Erro no login:', error.message);
			toast.error(error.message);
		} else {
			console.log('Login sucesso! Redirecionando...');
			goto('/');
		}
	}

	async function handleGoogleLogin() {
		console.log('Iniciando login Google...');
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'google'
		});

		if (error) {
			console.error('Erro Google:', error);
			toast.error(error.message);
		}
	}
</script>

<div class="card" transition:fade>
	{#if t && t.auth}
		<h1>{t.auth.loginTitle}</h1>

		<form
			onsubmit={(e) => {
				console.log('Form onsubmit disparado');
				e.preventDefault();
				handleLogin();
			}}
		>
			<div class="field">
				<label for="email">{t.auth.emailLabel}</label>
				<input type="email" id="email" bind:value={email} required />
			</div>

			<div class="field">
				<label for="password">{t.auth.passwordLabel}</label>
				<input type="password" id="password" bind:value={password} required />
			</div>

			<Button type="submit" disabled={loading} style="width: 100%; justify-content: center;">
				{loading ? '...' : t.auth.loginButton}
			</Button>
		</form>

		<div class="divider">
			<span>{t.auth.or}</span>
		</div>

		<Button onclick={handleGoogleLogin} style="width: 100%; justify-content: center;">
			{t.auth.googleLogin}
		</Button>

		<p>
			<a href="/signup">{t.auth.noAccount}</a>
		</p>
	{:else}
		<p>Carregando traduções...</p>
	{/if}
</div>

<style>
	div {
		display: flex;
		flex-direction: column;

		&.card {
			width: 100%;
			max-width: 400px;
			background: var(--surface);
			padding: var(--xl);
			border-radius: var(--radius-out);
			box-shadow: var(--shadow-lg);
			display: flex;
			flex-direction: column;
			gap: var(--md);
		}
		&.field {
			gap: var(--xxs);
		}
		&.divider {
			flex-direction: row;
			align-items: center;
			color: var(--text-secondary);
			font-size: var(--sm);

			&::before,
			&::after {
				content: '';
				flex: 1;
				border-bottom: var(--border) var(--border-color);
			}
		}
	}

	h1 {
		text-align: center;
		font-size: var(--xxl);
	}

	form {
		display: flex;
		flex-direction: column;
		gap: var(--md);
	}

	label {
		font-size: var(--sm);
		font-weight: 600;
		color: var(--text-secondary);
	}

	input {
		padding: var(--sm);
		border: 2px solid var(--border-color);
		border-radius: var(--radius-in);
		font-size: var(--md);
		color: var(--text-primary);
		background: var(--bg);
		transition: border-color var(--fast);

		&:focus {
			border-color: var(--brand-primary);
		}
	}

	p {
		text-align: center;
		margin: 0;
	}

	a {
		font-size: var(--sm);
	}

	span {
		padding: 0 var(--xs);
	}
</style>
