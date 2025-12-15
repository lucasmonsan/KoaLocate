<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/services/supabase';
	import Button from '$lib/components/ui/Button.svelte';
	import { i18n } from '$lib/i18n/i18n.svelte';
	import { toast } from '$lib/components/toast/toast.svelte';
	import { fade } from 'svelte/transition';

	let email = $state('');
	let password = $state('');
	let name = $state('');
	let loading = $state(false);

	let t = $derived(i18n.t);

	async function handleSignup() {
		if (!email || !password || !name) {
			toast.error(t.auth?.errors.generic || 'Preencha todos os campos');
			return;
		}

		if (password.length < 6) {
			toast.error(t.auth?.errors.passwordShort || 'Senha curta demais');
			return;
		}

		loading = true;
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					full_name: name
				}
			}
		});

		loading = false;

		if (error) {
			toast.error(error.message);
		} else {
			toast.success('Conta criada! Verifique seu e-mail.');
			goto('/login');
		}
	}
</script>

<div class="container" transition:fade>
	<div class="card">
		{#if t && t.auth}
			<h1>{t.auth.signupTitle}</h1>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSignup();
				}}
			>
				<div class="field">
					<label for="name">{t.auth.nameLabel}</label>
					<input type="text" id="name" bind:value={name} required />
				</div>

				<div class="field">
					<label for="email">{t.auth.emailLabel}</label>
					<input type="email" id="email" bind:value={email} required />
				</div>

				<div class="field">
					<label for="password">{t.auth.passwordLabel}</label>
					<input type="password" id="password" bind:value={password} required minlength="6" />
				</div>

				<Button type="submit" disabled={loading} style="width: 100%; justify-content: center;">
					{loading ? '...' : t.auth.signupButton}
				</Button>
			</form>

			<p>
				<a href="/login">{t.auth.hasAccount}</a>
			</p>
		{:else}
			<p>Carregando...</p>
		{/if}
	</div>
</div>

<style>
	div {
		&.container {
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 100dvh;
			padding: var(--md);
			background: var(--bg);
			border: solid;
		}

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
			display: flex;
			flex-direction: column;
			gap: var(--xxs);
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
</style>
