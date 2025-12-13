export interface OSMProperties {
  osm_id: number;
  osm_key: string;
  osm_value: string;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  street?: string;
  extent?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
}

export interface OSMFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: OSMProperties;
}

export interface PhotonResponse {
  type: 'FeatureCollection';
  features: OSMFeature[];
}

export type PlaceType = 'area' | 'point';

export type PlaceKey = `${string}:${string}`;