<script lang="ts">
	import { Loading } from 'carbon-components-svelte';
	export let activeLoading: boolean = false;
	export let label: string;
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
