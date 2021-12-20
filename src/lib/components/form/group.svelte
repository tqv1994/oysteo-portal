<script lang="ts">
	import { Button, Form, FormGroup, Link } from 'carbon-components-svelte';
	import { RequestQuote16 } from 'carbon-icons-svelte';
	import { createEventDispatcher } from 'svelte';

	export let isEditing = false;
	export let groupName = '';
	export let editLabel = 'Edit';
	export let groupClass = 'group';
	export let isPhotoGroup = false;
	export let hideEditButton = false;
	export let disabledRemoveButton = true;

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

<div class={groupClass + (isEditing ? ' group-border' : '')}>
	{#if isEditing}
		<div class="form {groupClass.includes('group-add') ? 'mtop-16 mbottom-32' : ''}">
			<Form on:submit={onSubmit}>
				<FormGroup>
					<slot {isEditing} />
				</FormGroup>
				<div class="group-buttons">
					<Button class="btn-cancel" on:click={onCancel}>Cancel</Button>
					{#if isPhotoGroup}
						<Button class="btn-remove" type="submit" disabled={disabledRemoveButton}>Remove</Button>
					{:else if groupClass.includes('group-add')}
						<Button type="submit">Add</Button>
					{:else}
						<Button type="submit">Update</Button>
					{/if}
				</div>
			</Form>
		</div>
	{:else if !groupClass.includes('group-add')}
		<div class="values">
			<slot {isEditing} />
		</div>

		{#if groupName === '' && !hideEditButton}
			<div class="actions">
				<Link on:click={onEdit}>{editLabel}&nbsp;<RequestQuote16 /></Link>
			</div>
		{:else}
			<div class="group-name">
				<p>{groupName}</p>
			</div>
		{/if}
	{/if}
</div>

<style lang="scss">
	$break_point: 1056px;
	:global(h4 + .group) {
		border-top: none !important;
	}
	.group {
		display: flex;
		padding: 2em 0;
		margin-bottom: 2em;
		border-top: 1px solid #707070;
		:global(.group-buttons .bx--btn) {
			width: 100%;
			max-width: none;
			margin-bottom: 1em;
		}
	}

	.group-add {
		padding: 0;
		&.group-border {
			border-bottom: 1px solid #707070;
			padding-bottom: 2rem;
			padding-top: 1rem;
		}
		& + .row {
			margin-top: 0rem;
		}
	}

	.group-below-add {
		border-top: none;
		margin-top: -2rem;
	}
	.image-group-agency {
		border-top: none;
		padding: 0;
		margin-top: -1rem;
	}
	.actions {
		flex: 0 0 4rem;
		text-align: right;
		cursor: pointer;
	}
	.group-name {
		flex: 0 0 3.5rem;
		padding-left: 0.925rem;
		p {
			font-size: 14px;
		}
	}
	.group-buttons {
		margin-bottom: -2rem;
	}
	.group-aboutme,
	.group-destinations {
		margin-bottom: 0rem;
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
			margin-left: 10rem;
			gap: 1rem;
		}
		.group {
			:global(.group-buttons .bx--btn) {
				width: 30%;
			}
		}
	}
</style>
