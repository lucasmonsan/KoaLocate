import type { OSMFeature } from './osm.types';

export interface CacheItem {
  query: string;
  results: OSMFeature[];
  timestamp: number;
}

export type SearchResult = OSMFeature;