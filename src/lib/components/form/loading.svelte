<script lang="ts">
	import { Loading } from 'carbon-components-svelte';
	import { onMount } from 'svelte';
	export let activeLoading = false;
	export let label = '';

	export const openLoading = (open: boolean, labelLoad = 'Saving...') => {
		activeLoading = open;
		label = labelLoad;
	};
	onMount(() => {
		window.openLoading = openLoading;
	});
</script>

{#if activeLoading}
	<Loading active={activeLoading} />
	<p>{label}</p>
{/if}

<style lang="scss">
	p {
		position: fixed;
		z-index: 6100;
		top: 4rem;
		left: 0;
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
		color: #eee;
	}
</style>
