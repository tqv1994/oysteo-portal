<script lang="ts">
import { validateEmail } from '$lib/helpers/utils';
import type { AdvisorAgency } from '$lib/store/advisor';

	import { formChangeStatusStore } from '$lib/store/formChangeStatus';
	import { Button, Form, FormGroup, Link, Modal } from 'carbon-components-svelte';
	import { RequestQuote16 } from 'carbon-icons-svelte';
	import { createEventDispatcher } from 'svelte';

	export let isEditing = false;
	export let customGroupStyle = '';
	export let reSend = false;
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
			window.openWarningSaveForm({handleConfirm: onEdit});
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
					{#if reSend}
						<Button class="re-send" on:click={onSend}>Re-send invitation</Button>
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
