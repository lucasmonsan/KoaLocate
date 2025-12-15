import { supabase } from "$lib/services/supabase";
import type { User, Session } from '@supabase/supabase-js';

class AuthState {
  session = $state<Session | null>(null);
  user = $state<User | null>(null);
  loading = $state(true);

  constructor() {
    this.init();
  }

  async init() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      this.setSession(session);

      supabase.auth.onAuthStateChange((_event, session) => {
        this.setSession(session);
        this.loading = false;
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.loading = false;
    }
  }

  private setSession(session: Session | null) {
    this.session = session;
    this.user = session?.user ?? null;
  }

  async signOut() {
    await supabase.auth.signOut();
    this.session = null;
    this.user = null;
  }
}

export const authState = new AuthState();