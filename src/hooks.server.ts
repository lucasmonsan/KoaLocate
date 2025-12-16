import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { redirect, type Handle } from '@sveltejs/kit';

const PUBLIC_ROUTES = ['/auth/callback'];
const AUTH_URL = 'https://monsan.duckdns.org';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				get(name) {
					return event.cookies.get(name);
				},
				set(name, value, options) {
					event.cookies.set(name, value, {
						...options,
						path: '/',
						domain: '.monsan.duckdns.org',
						secure: true,
						httpOnly: true,
						sameSite: 'lax'
					});
				},
				remove(name, options) {
					event.cookies.delete(name, {
						...options,
						path: '/',
						domain: '.monsan.duckdns.org'
					});
				}
			}
		}
	);

	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	const session = await event.locals.getSession();
	const isPublicRoute = PUBLIC_ROUTES.some(route => event.url.pathname.startsWith(route));

	// Redireciona para Monsan Auth se não estiver autenticado
	if (!session && !isPublicRoute) {
		const redirectUrl = `${AUTH_URL}/login?redirect=${encodeURIComponent(event.url.href)}`;
		throw redirect(307, redirectUrl);
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};

