class MapState {
  private map: any = $state(null);

  setMap(mapInstance: any) {
    this.map = mapInstance;
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
          console.error('Erro ao obter localização:', error);
          alert('Não foi possível obter sua localização.');
        }
      );
    } else {
      alert('Geolocalização não suportada pelo seu navegador.');
    }
  }
}

export const mapState = new MapState();