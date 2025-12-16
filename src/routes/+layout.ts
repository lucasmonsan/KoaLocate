import { supabase } from '$lib/services/supabase';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, depends }) => {
	depends('supabase:auth');

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return {
		session: session ?? data.session,
		supabase
	};
};

