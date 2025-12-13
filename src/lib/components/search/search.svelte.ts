import { mapState } from '../map/map.svelte';

interface CacheItem {
  query: string;
  results: any[];
  timestamp: number;
}

class SearchState {
  query = $state('');
  focused = $state(false);
  loading = $state(false);
  results = $state<any[]>([]);
  hasSearched = $state(false);

  lastSearchedQuery = $state('');
  private isResultSelected = false;
  private CACHE_KEY = 'localista_search_v2'; // Mudança de chave para invalidar cache antigo
  private CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

  constructor() {
    this.cleanOldCache();
  }

  clear() {
    this.query = '';
    this.results = [];
    this.hasSearched = false;
    this.isResultSelected = false;
    this.lastSearchedQuery = '';
  }

  setQuery(value: string) {
    this.query = value;
    this.isResultSelected = false;
    this.hasSearched = false;

    if (value.length > 2) {
      const localResults = this.searchInCache(value);
      if (localResults && localResults.length > 0) {
        this.results = localResults;
        this.hasSearched = true;
      }
    } else {
      this.results = [];
    }
  }

  async search() {
    if (!this.query.trim()) return;
    if (this.query === this.lastSearchedQuery) return;
    if (this.isResultSelected) return;

    this.loading = true;
    this.hasSearched = false;

    try {
      // Tenta cache exato primeiro
      const cached = this.getFromCache(this.query);
      if (cached) {
        this.results = cached;
        this.finishSearch();
        return;
      }

      const center = mapState.getCenter();
      let url = `https://photon.komoot.io/api/?q=${encodeURIComponent(this.query)}&limit=20&lang=pt`;

      if (center && typeof center.lat === 'number' && typeof center.lng === 'number') {
        url += `&lat=${center.lat}&lon=${center.lng}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        if (url.includes('&lang=pt')) {
          const fallbackUrl = url.replace('&lang=pt', '');
          const fallbackResponse = await fetch(fallbackUrl);
          if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            this.processResults(data);
            return;
          }
        }
        this.results = [];
        return;
      }

      const data = await response.json();
      this.processResults(data);

    } catch (error) {
      this.results = [];
    } finally {
      this.finishSearch();
    }
  }

  private processResults(data: any) {
    if (!data || !data.features) {
      this.results = [];
    } else {
      const uniqueResults = this.filterDuplicates(data.features);
      const finalResults = uniqueResults.slice(0, 8);
      this.results = finalResults;
      this.saveToCache(this.query, finalResults);
    }
  }

  selectResult(result: any) {
    const label = result.properties.name;
    this.query = label;
    this.lastSearchedQuery = label;
    this.isResultSelected = true;
    this.results = [];
    this.focused = false;

    mapState.selectLocation(result);
  }

  private finishSearch() {
    this.loading = false;
    this.hasSearched = true;
    this.lastSearchedQuery = this.query;
  }

  private normalizeStr(str: string) {
    return str ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
  }

  private filterDuplicates(features: any[]) {
    if (!Array.isArray(features)) return [];

    const seenIds = new Set();
    const seenKeys = new Set();

    return features.filter((feature) => {
      const p = feature.properties;

      if (p.country === 'Brazil') p.country = 'Brasil';

      if (p.osm_id) {
        if (seenIds.has(p.osm_id)) return false;
        seenIds.add(p.osm_id);
      }

      let uniqueKey = '';
      const name = this.normalizeStr(p.name);
      const city = this.normalizeStr(p.city);
      const street = this.normalizeStr(p.street);

      if (p.osm_key === 'highway') {
        uniqueKey = `street|${name}|${city}`;
      } else {
        uniqueKey = `poi|${name}|${city}|${street}`;
      }

      if (!name) return true;

      if (seenKeys.has(uniqueKey)) return false;
      seenKeys.add(uniqueKey);
      return true;
    });
  }

  private getCache(): CacheItem[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.CACHE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  private getFromCache(query: string): any[] | null {
    const cache = this.getCache();
    const item = cache.find((c) => c.query.toLowerCase() === query.toLowerCase());
    if (item && Date.now() - item.timestamp < this.CACHE_TTL) {
      return item.results;
    }
    return null;
  }

  private searchInCache(partialQuery: string): any[] | null {
    const cache = this.getCache();
    const normalizedQuery = this.normalizeStr(partialQuery);

    // Encontra a entrada de cache mais relevante
    const cacheMatch = cache.find(c => this.normalizeStr(c.query).includes(normalizedQuery));

    if (!cacheMatch) return null;

    // Filtra os resultados que ainda batem com o input
    const filteredResults = cacheMatch.results.filter(result => {
      const name = this.normalizeStr(result.properties.name);
      return name.includes(normalizedQuery);
    });

    return filteredResults.length > 0 ? filteredResults : null;
  }

  private saveToCache(query: string, results: any[]) {
    if (typeof localStorage === 'undefined') return;
    try {
      const cache = this.getCache();
      const newCache = cache.filter(c => c.query.toLowerCase() !== query.toLowerCase());

      newCache.push({
        query,
        results,
        timestamp: Date.now()
      });

      if (newCache.length > 50) newCache.shift();

      localStorage.setItem(this.CACHE_KEY, JSON.stringify(newCache));
    } catch (e) {
    }
  }

  private cleanOldCache() {
    if (typeof localStorage === 'undefined') return;
    try {
      const cache = this.getCache();
      const validCache = cache.filter(c => Date.now() - c.timestamp < this.CACHE_TTL);
      if (validCache.length !== cache.length) {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(validCache));
      }
    } catch (e) {
    }
  }
}

export const searchState = new SearchState();