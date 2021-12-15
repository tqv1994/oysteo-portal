<script lang="ts">
	import { Tile } from 'carbon-components-svelte';
	import { Add20 } from 'carbon-icons-svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let title: string;
	export let icon: any;
	export let rightIcon = false;
	export let id = '';
	export let titleRightIcon = '';

	const handleClick = () => {
		dispatch('add');
	};
</script>

<div class="section" {id}>
	<Tile>
		<h4>{title} <svelte:component this={icon} style={'transform: translate(0,.15rem);'} /></h4>

		<slot />
	</Tile>
	{#if rightIcon}
		<div class="right-icon" on:click={handleClick}>
			<span class="title-right-icon">{titleRightIcon}</span><Add20 style="fill:white;" />
		</div>
	{/if}
</div>

<style lang="scss">
	.section {
		margin-bottom: 1em;
		position: relative;
		scroll-margin-top: 5rem;
	}
	h4 {
		border-bottom: 2px solid #707070;
		margin: 0 -0.8em;
		padding: 0 1em;
		line-height: 3em;
		padding-left: 1rem;
	}

	.right-icon {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background-color: #707070;
		cursor: pointer;
		padding: 0.25rem;
		&:focus,
		&:hover {
			border: 1px solid blue;
			top: 0.9375rem;
			right: 0.9375rem;
		}
	}

	@media (min-width: 1056px) {
		.right-icon {
			padding: 0.5rem 1rem;
		}
	}
</style>
