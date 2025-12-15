<script lang="ts">
	import 'leaflet/dist/leaflet.css';
	import { mapState } from './map.svelte';
	import { themeState } from '$lib/stores/theme.svelte';
	import { MAP_CONFIG } from '$lib/constants/config';

	let mapElement: HTMLElement;
	let currentTileLayer: any;

	function getTileUrl(theme: string): string {
		if (theme === 'auto') {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			return prefersDark ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png' : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
		}

		if (theme === 'dark') {
			return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
		}
		return 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
	}

	$effect(() => {
		const theme = themeState.current;
		const map = mapState.getMap();
		const L = (window as any).L;

		if (map && L && currentTileLayer) {
			map.removeLayer(currentTileLayer);
			currentTileLayer = L.tileLayer(getTileUrl(theme), {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
				maxZoom: 20
			}).addTo(map);
		}
	});

	$effect(() => {
		let map: any;
		let resizeObserver: ResizeObserver;

		const initMap = async () => {
			if (!mapElement) return;

			const L = (await import('leaflet')).default;
			(window as any).L = L;

			delete (L.Icon.Default.prototype as any)._getIconUrl;
			L.Icon.Default.mergeOptions({
				iconUrl: '',
				iconRetinaUrl: '',
				shadowUrl: ''
			});

			map = L.map(mapElement, {
				zoomControl: false,
				attributionControl: false
			}).setView(MAP_CONFIG.DEFAULT_CENTER, MAP_CONFIG.DEFAULT_ZOOM);

			currentTileLayer = L.tileLayer(getTileUrl(themeState.current), {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
				maxZoom: 20
			}).addTo(map);

			mapState.setMap(map, L);

			resizeObserver = new ResizeObserver(() => map.invalidateSize());
			resizeObserver.observe(mapElement);
		};

		initMap();

		return () => {
			resizeObserver?.disconnect();
			map?.remove();
			mapState.setMap(null, null);
		};
	});
</script>

<div bind:this={mapElement}></div>

<style>
	div {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: var(--z-map, 1);
		background-color: var(--bg);
	}
</style>
