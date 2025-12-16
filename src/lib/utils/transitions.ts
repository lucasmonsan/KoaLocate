import { cubicOut } from 'svelte/easing';

export const slideUp = (node: Element, { duration = 250, distance = 20 } = {}) => ({
  duration,
  css: (t: number) => {
    const eased = cubicOut(t);
    return `
			transform: translateY(${(1 - eased) * distance}px);
			opacity: ${eased};
		`;
  }
});

export const slideDown = (node: Element, { duration = 250, distance = 20 } = {}) => ({
  duration,
  css: (t: number) => {
    const eased = cubicOut(t);
    return `
			transform: translateY(${(eased - 1) * distance}px);
			opacity: ${eased};
		`;
  }
});