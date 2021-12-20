<script lang="ts">
	import { Button, Form, FormGroup, Link } from 'carbon-components-svelte';
	import { RequestQuote16 } from 'carbon-icons-svelte';
	import { createEventDispatcher } from 'svelte';

	export let isEditing = false;
	export let customGroupStyle = '';
	const dispatch = createEventDispatcher();

	function onEdit() {
		dispatch('edit');
	}

	function onSubmit() {
		dispatch('submit');
	}

	function onCancel() {
		dispatch('cancel');
	}
</script>

<div class="group" style={customGroupStyle}>
	{#if isEditing}
		<div class="form">
			<Form on:submit>
				<FormGroup>
					<slot {isEditing} />
				</FormGroup>
				<div class="group-buttons">
					<Button class="btn-cancel" on:click={onCancel}>Cancel</Button>
					<Button type="submit">Update</Button>
				</div>
			</Form>
		</div>
	{:else}
		<div class="values">
			<slot {isEditing} />
		</div>
		<div class="actions">
			<Link on:click={onEdit}>Edit&nbsp;<RequestQuote16 /></Link>
		</div>
	{/if}
</div>

<style lang="scss">
	$break_point: 1056px;
	:global(h4 + .group) {
		border-top: none !important;
	}
	.group {
		display: flex;
		margin-top: 2em;
		:global(.group-buttons .bx--btn) {
			width: 100%;
			max-width: none;
			margin-bottom: 1em;
		}
	}

	.group-buttons {
		margin-top: 1rem;
	}

	.actions {
		flex: 0 0 4rem;
		text-align: right;
	}
	.group-name {
		flex: 0 0 4rem;
		text-align: center;
	}
	.form {
		flex: 1;
	}
	.values {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	@media (min-width: $break_point) {
		.form {
			flex: 1;
			margin-right: 7rem;
		}

		.group-buttons {
			display: flex;
			flex-direction: row;
			gap: 1rem;
		}
		.group {
			:global(.group-buttons .bx--btn) {
				width: 30%;
			}
		}
	}
</style>
