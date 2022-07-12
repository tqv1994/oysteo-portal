<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Button, Form, FormGroup, InlineLoading, Link } from 'carbon-components-svelte';
	import { RequestQuote } from 'carbon-icons-svelte';
	import { saving } from '$lib/store/saving';
	import { getFormValues } from '$lib/helpers/utils';
	import { activateOrHighlight, clear, subscribe } from '$lib/store/activeForm';

	export let groupName = '';
	export let editLabel = 'Edit';
	export let groupClass = 'group';
	export let isPhotoGroup = false;
	export let hideEditButton = false;
	export let disabledRemoveButton: boolean = true;
	export let hideEditIcon = false;
	export let data:
		| Record<string, string | number | boolean>
		| Record<string, string | number | boolean>[] = undefined;
	export let subdata:
		| Record<string, string | number | boolean>
		| Record<string, string | number | boolean>[] = undefined;
	export let form: HTMLFormElement | undefined = undefined;

	export let isEditing = false;

	export function activate() {
		if (Array.isArray(data)) {
			if (data.length === 0) {
				activateOrHighlight(id, undefined);
			} else {
				for (const item of data) {
					activateOrHighlight(id, item);
				}
			}
		} else {
			activateOrHighlight(id, data);
		}
	}

	export function cancel() {
		clear();
		dispatch('cancel');
	}

	const id = new Date().getTime().toString(36) + Math.random().toString(36).substring(2);
	const dispatch = createEventDispatcher();

	subscribe((s) => {
		isEditing = s && s.id === id;
	});

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		dispatch('submit', getFormValues(form));
	}
</script>

<div class={groupClass + (isEditing ? ' group-border' : '')}>
	{#if isEditing}
		<div class="form {groupClass.includes('group-add') ? 'mtop-16 mbottom-32' : ''}">
			<Form on:submit={onSubmit} bind:ref={form} {id}>
				<FormGroup>
					<slot {isEditing} />
					{#if $saving}
						<div class="saving-modal" />
					{/if}
				</FormGroup>
				<div class="group-buttons">
					{#if $saving}
						<InlineLoading status="active" description="Saving..." />
					{:else}
						<Button class="btn-cancel" on:click={cancel}>Cancel</Button>
						{#if isPhotoGroup}
							<Button class="btn-remove" type="submit" disabled={disabledRemoveButton}
								>Remove</Button
							>
						{:else if groupClass.includes('group-add')}
							<Button type="submit">Add</Button>
						{:else}
							<Button type="submit">Update</Button>
						{/if}
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
				<Link on:click={activate} class="btn-edit"
					>{editLabel}&nbsp;{#if !hideEditIcon}<RequestQuote size={16} />{/if}</Link
				>
			</div>
		{:else}
			<div class="">
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
		border-bottom: 1px solid #707070;
		:global(.group-buttons .bx--btn) {
			width: 100%;
			max-width: none;
			margin-bottom: 1em;
		}
	}
	.group-add {
		padding: 0;
		border-bottom: none;
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
		position: relative;
	}
	.values {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.saving-modal {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.4);
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
