export function normalizeStr(str: string | undefined): string {
  return str
    ? str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    : '';
}

export function highlightMatch(text: string, query: string): string {
  if (!query || !text) return text;

  const normalized = normalizeStr(text);
  const normalizedQuery = normalizeStr(query);
  const index = normalized.indexOf(normalizedQuery);

  if (index === -1) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);

  return `${before}<mark>${match}</mark>${after}`;
}