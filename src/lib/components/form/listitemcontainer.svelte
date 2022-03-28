<script lang="ts">
	import { formChangeStatusStore } from '$lib/store/formChangeStatus';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { Button, Form, FormGroup, InlineLoading, Link, Modal } from 'carbon-components-svelte';
	import { RequestQuote16 } from 'carbon-icons-svelte';
	import { createEventDispatcher } from 'svelte';
	import { openWarningSaveForm } from './PopupWarningSaveForm.svelte';

	export let isEditing = false;
	export let customGroupStyle = '';
	export let reSend = false;
	export let hasDelete = false;
	const dispatch = createEventDispatcher();

	function onEdit() {
		if ($formChangeStatusStore.changing === false) {
			dispatch('edit');
			setTimeout(() => {
				const form = document.querySelector('form');
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
		formChangeStatusStore.set({ changing: false });
	}

	function onCancel() {
		dispatch('cancel');
		formChangeStatusStore.set({ changing: false });
	}
	function onSend() {
		dispatch('send');
		formChangeStatusStore.set({ changing: false });
	}

	function onDelete() {
		dispatch('delete');
		formChangeStatusStore.set({ changing: false });
	}
</script>

<div class="group" style={customGroupStyle}>
	{#if isEditing}
		<div class="form">
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
						<Button type="submit">Update</Button>
						{#if reSend}
							<Button class="re-send" on:click={onSend}>Re-send invitation</Button>
						{/if}
						{#if hasDelete}
							<Button class="re-send" on:click={onDelete}>Delete</Button>
						{/if}
					{/if}
				</div>
			</Form>
		</div>
	{:else}
		<div class="values">
			<slot {isEditing} />
		</div>
		<div class="actions">
			<Link on:click={onEdit} class="btn-edit">Edit&nbsp;<RequestQuote16 /></Link>
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
			gap: 1rem;
		}
		.group {
			:global(.group-buttons .bx--btn) {
				width: 30%;
			}
		}
	}
</style>
