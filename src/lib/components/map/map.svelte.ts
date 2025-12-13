import { getPlaceType } from '$lib/utils/osm';
import '$lib/styles/pins.css';

class MapState {
  private map: any = $state(null);
  private L: any = null;
  private currentLayer: any = null;

  setMap(mapInstance: any, leafletLibrary: any) {
    this.map = mapInstance;
    this.L = leafletLibrary;
  }

  getCenter() {
    if (!this.map) return null;
    return this.map.getCenter();
  }

  locateUser() {
    if (!this.map) return;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.map.flyTo([latitude, longitude], 15);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  selectLocation(feature: any) {
    if (!this.map || !this.L) return;

    const { geometry, properties } = feature;
    const [lng, lat] = geometry.coordinates;
    const type = getPlaceType(properties);

    if (this.currentLayer) {
      this.map.removeLayer(this.currentLayer);
    }

    const cssClass = type === 'area' ? 'area-marker' : 'pin-marker';
    const icon = this.L.divIcon({
      className: 'custom-pin',
      html: `<div class="${cssClass}"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    this.currentLayer = this.L.marker([lat, lng], { icon }).addTo(this.map);

    if (properties.extent) {
      const [minLng, minLat, maxLng, maxLat] = properties.extent;
      this.map.fitBounds([
        [minLat, minLng],
        [maxLat, maxLng]
      ], {
        padding: [50, 50],
        maxZoom: 16,
        animate: true
      });
    } else {
      this.map.flyTo([lat, lng], 16, {
        animate: true,
        duration: 1.5
      });
    }
  }
}

export const mapState = new MapState();