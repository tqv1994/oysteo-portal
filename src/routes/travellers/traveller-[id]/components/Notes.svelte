<script lang="ts">
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { TextArea } from 'carbon-components-svelte';
	import { type Traveller, travellersStore } from '$lib/store/traveller';
	import { updateTravellerService } from '$lib/services/traveller.service';
	import { notify } from '$lib/components/Toast.svelte';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { get } from 'svelte/store';
	import { ppatch } from '$lib/utils/fetch';
	import { clear } from '$lib/store/activeForm';

	export let traveller: Traveller;
	type FormData = {
		notes?: string;
	};
	type FormError = {
		notes?: string;
	};
	let activeSection = '';
	let notes: string = traveller?.notes;
	let formErrors: FormError;
	let formData: FormData = reset();

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	function reset(): FormData {
		return {
			notes: notes || null
		};
	}

	const onCancel = () => {
		notes = traveller?.notes;
		formData = reset();
	};

	const onSubmit = async () => {
		const errors: FormError = {};

		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}
		isFormSavingStore.set({ saving: true });
		try {
			const res = await ppatch(`travellers/${traveller.id}`, formData);
			if (res.ok) {
				traveller = await res.json();
				const index = get(travellersStore).findIndex(
					(item) => item.id.toString() === traveller.id.toString()
				);
				if (index >= 0) {
					travellersStore.update((s) => {
						s[index] = traveller;
						return s;
					});
				}
				clear();
			} else {
				notify({
					title: 'Update failed',
					subtitle: 'Failed to update information, please try again later.'
				});
			}
		} catch (error) {
			notify({
				title: 'Update failed',
				subtitle: 'Failed to update information, please try again later.'
			});
			console.error('Failed to update business insurance', error);
		}

		isFormSavingStore.set({ saving: false });
	};
</script>

<FormGroup
	let:isEditing
	on:cancel={onCancel}
	on:submit={onSubmit}
	data={{ notes: formData.notes || '' }}
>
	<FormRow label="Notes" {isEditing}>
		<div slot="value">
			{traveller.notes || ''}
		</div>
		<div slot="fields">
			<TextArea
				bind:value={formData.notes}
				invalid={!!formErrors?.notes}
				invalidText={formErrors?.notes}
				name="notes"
			/>
		</div>
	</FormRow>
</FormGroup>

<!-- <FormGroup hideEditButton>
	<FormRow label="Notes">
		{traveller.notes || ''}
	</FormRow>
</FormGroup> -->
