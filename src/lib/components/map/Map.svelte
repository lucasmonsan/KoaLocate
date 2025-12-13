<script lang="ts">
	import 'leaflet/dist/leaflet.css';
	import { mapState } from './map.svelte';

	let mapElement: HTMLElement;

	$effect(() => {
		let map: any;
		let resizeObserver: ResizeObserver;

		const initMap = async () => {
			if (!mapElement) return;

			const L = (await import('leaflet')).default;

			delete (L.Icon.Default.prototype as any)._getIconUrl;
			L.Icon.Default.mergeOptions({
				iconUrl: '',
				iconRetinaUrl: '',
				shadowUrl: ''
			});

			map = L.map(mapElement, {
				zoomControl: false,
				attributionControl: false
			}).setView([-23.5505, -46.6333], 13);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; OpenStreetMap contributors'
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
