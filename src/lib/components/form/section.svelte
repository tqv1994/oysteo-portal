<script lang="ts">
	import { formChangeStatusStore } from '$lib/store/formChangeStatus';
	import { Tile } from 'carbon-components-svelte';
	import { Add as AddIcon } from 'carbon-icons-svelte';
	import { createEventDispatcher, SvelteComponent } from 'svelte';
	import { openWarningSaveForm } from './PopupWarningSaveForm.svelte';

	export let title: string;
	export let icon: typeof SvelteComponent = null;
	export let id = '';
	export let actionLabel: string = undefined;
	export function scrollIntoView() {
		root.scrollIntoView();
	}

	const dispatch = createEventDispatcher();
	let root: HTMLDivElement;

	const handleClick = () => {
		dispatch('add');
		// if ($formChangeStatusStore.changing === false) {
		// 	(root.querySelector('input, select, textarea') as HTMLFormElement)?.focus();
		// 	root.addEventListener('input', function () {
		// 		formChangeStatusStore.set({ changing: true });
		// 	});
		// } else {
		// 	openWarningSaveForm({ handleConfirm: handleClick });
		// }
	};
</script>

<div class="section" {id} bind:this={root}>
	<Tile>
		<h4>
			{title}
			<svelte:component this={icon} size={20} style={'transform: translate(0,.15rem);'} />
		</h4>
		<slot />
	</Tile>
	{#if actionLabel}
		<div class="right-icon btn-edit" on:click={handleClick}>
			<span class="title-right-icon">{actionLabel}</span><AddIcon size={20} style="fill:white;" />
		</div>
	{/if}
</div>

<style lang="scss">
	.section {
		margin-bottom: 1em;
		position: relative;
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
		top: 4rem;
		right: 1rem;
		background-color: #707070;
		cursor: pointer;
		padding: 0.25rem;
		&:focus,
		&:hover {
			border: 1px solid blue;
			top: 4rem;
			right: 0.9375rem;
		}
	}

	@media (min-width: 1056px) {
		.right-icon {
			padding: 0.5rem 1rem;
		}
	}
</style>
