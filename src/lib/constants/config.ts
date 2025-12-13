export const CACHE_CONFIG = {
  KEY: 'localista_search_v2',
  TTL: 7 * 24 * 60 * 60 * 1000, // 7 dias em millisegundos
  MAX_ENTRIES: 50,
} as const;

export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 3,
  MAX_DISPLAYED_RESULTS: 8,
} as const;

export const MAP_CONFIG = {
  DEFAULT_CENTER: [-23.5505, -46.6333] as [number, number], // São Paulo
  DEFAULT_ZOOM: 13,
  SEARCH_ZOOM: 16,
  MARKER_SIZE: 16,
  FIT_BOUNDS_PADDING: 50,
  FIT_BOUNDS_MAX_ZOOM: 16,
} as const;