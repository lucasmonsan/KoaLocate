<script lang="ts">
	interface Props {
		src: string;
		alt: string;
		class?: string;
		placeholder?: string;
		aspectRatio?: string;
	}

	let { src, alt, class: className = '', placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23e5e7eb"/%3E%3C/svg%3E', aspectRatio = 'auto' }: Props = $props();

	let imageElement: HTMLImageElement | undefined = $state();
	let loaded = $state(false);
	let error = $state(false);

	function handleLoad() {
		loaded = true;
	}

	function handleError() {
		error = true;
		loaded = true;
	}
</script>

<div class="lazy-image-wrapper {className}" style="aspect-ratio: {aspectRatio};">
	<img
		bind:this={imageElement}
		{src}
		{alt}
		loading="lazy"
		decoding="async"
		class:loaded
		class:error
		onload={handleLoad}
		onerror={handleError}
	/>
	{#if !loaded}
		<div class="placeholder">
			<img src={placeholder} alt="" />
		</div>
	{/if}
</div>

<style>
	.lazy-image-wrapper {
		position: relative;
		overflow: hidden;
		background: var(--bg);
		border-radius: inherit;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	img.loaded {
		opacity: 1;
	}

	img.error {
		opacity: 0.5;
	}

	.placeholder {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: pulse 2s ease-in-out infinite;
	}

	.placeholder img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: blur(10px);
		transform: scale(1.1);
	}

	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}
</style>

