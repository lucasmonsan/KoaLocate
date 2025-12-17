import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	// Aceita tanto 'redirect' quanto 'next' para compatibilidade
	const redirectTo = url.searchParams.get('redirect') || url.searchParams.get('next') || '/';

	if (code) {
		const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
		
		if (error) {
			// Se houver erro, redireciona para home
			throw redirect(303, '/');
		}
	}

	throw redirect(303, redirectTo);
};

