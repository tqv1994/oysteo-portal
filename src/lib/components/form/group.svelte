<script lang="ts">
	import { focusInput } from '$lib/helpers/scripts';

	import { formChangeStatusStore } from '$lib/store/formChangeStatus';
	import { isFormSavingStore } from '$lib/store/isFormSaving';

	import { Button, Form, FormGroup, InlineLoading, Link } from 'carbon-components-svelte';
	import { RequestQuote16 } from 'carbon-icons-svelte';
	import { createEventDispatcher } from 'svelte';
	import { openWarningSaveForm } from '$lib/components/form/PopupWarningSaveForm.svelte';

	export let isEditing = false;
	export let groupName = '';
	export let editLabel = 'Edit';
	export let groupClass = 'group';
	export let isPhotoGroup = false;
	export let hideEditButton = false;
	export let disabledRemoveButton = true;
	export let hideEditIcon = false;

	const dispatch = createEventDispatcher();

	function onEdit() {
		if ($formChangeStatusStore.changing === false) {
			dispatch('edit');
			setTimeout(() => {
				const form = document.querySelector('form');
				focusInput(form);
				form.addEventListener('input', function () {
					formChangeStatusStore.set({ changing: true });
				});
			}, 0);
		} else {
			openWarningSaveForm({ handleConfirm: onEdit });
		}
	}

	function onSubmit() {
		dispatch('submit');
		formChangeStatusStore.update((s) => {
			s.changing = false;
			return s;
		});
	}

	function onCancel() {
		dispatch('cancel');
		formChangeStatusStore.update((s) => {
			s.changing = false;
			return s;
		});
	}

	// function openWarningSaveForm(arg0: { handleConfirm: () => void }) {
	// 	throw new Error('Function not implemented.');
	// }
</script>

<div class={groupClass + (isEditing ? ' group-border' : '')}>
	{#if isEditing}
		<div class="form {groupClass.includes('group-add') ? 'mtop-16 mbottom-32' : ''}">
			<Form on:submit={onSubmit}>
				<FormGroup>
					<slot {isEditing} />
					{#if $isFormSavingStore.saving}
						<div class="saving-modal" />
					{/if}
				</FormGroup>
				<div class="group-buttons">
					{#if $isFormSavingStore.saving}
						<InlineLoading status="active" description="Saving..." />
					{:else}
						<Button class="btn-cancel" on:click={onCancel}>Cancel</Button>
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
				<Link on:click={onEdit} class="btn-edit"
					>{editLabel}&nbsp;{#if !hideEditIcon}<RequestQuote16 />{/if}</Link
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
