import { browser } from '$app/environment';

class ThemeState {
  current = $state('auto');

  constructor() {
    if (browser) {
      const saved = localStorage.getItem('theme');
      if (saved) {
        this.current = saved;
        this.apply(saved);
      }
    }
  }

  set(value: string) {
    this.current = value;
    if (browser) {
      localStorage.setItem('theme', value);
      this.apply(value);
    }
  }

  private apply(value: string) {
    if (!browser) return;

    const root = document.documentElement;
    if (value === 'light') root.setAttribute('data-theme', 'light');
    else if (value === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
  }
}

export const themeState = new ThemeState();