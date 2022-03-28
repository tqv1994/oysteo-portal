<script lang="ts">
	import { formChangeStatusStore } from '$lib/store/formChangeStatus';

	import { Tile } from 'carbon-components-svelte';
	import { Add20 } from 'carbon-icons-svelte';
	import { createEventDispatcher } from 'svelte';
	import { openWarningSaveForm } from './PopupWarningSaveForm.svelte';
	const dispatch = createEventDispatcher();

	export let title: string;
	export let icon: any | undefined;
	export let rightIcon = false;
	export let id = '';
	export let titleRightIcon = '';

	const handleClick = () => {
		if ($formChangeStatusStore.changing === false) {
			dispatch('add');
			setTimeout(() => {
				const form = document.querySelector('form');
				form.addEventListener('input', function () {
					formChangeStatusStore.set({ changing: true });
				});
			}, 0);
		} else {
			openWarningSaveForm({ handleConfirm: handleClick });
		}
	};
</script>

<div class="section" {id}>
	<Tile>
		<h4>{title} <svelte:component this={icon} style={'transform: translate(0,.15rem);'} /></h4>

		<slot />
	</Tile>
	{#if rightIcon}
		<div class="right-icon btn-edit" on:click={handleClick}>
			<span class="title-right-icon">{titleRightIcon}</span><Add20 style="fill:white;" />
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
