<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';
	import {
		type Trip,
		TRipInput,
		tripStore
	} from '$lib/store/trip';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { Column, Grid, Row, TextArea } from 'carbon-components-svelte';
	import type { Traveller } from '$lib/store/traveller';
	import type { Insurance } from '$lib/store/insurance';
	import { createTripService, updateTripService } from '$lib/services/trip.services';
	import { notify } from '$lib/components/Toast.svelte';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { ppatch, ppost } from '$lib/utils/fetch';
	import { clear } from '$lib/store/activeForm';
	export let trip: Trip | undefined;
	type FormData = {
		additionalInfo?: string;
	};
	type FormError = {
		additionalInfo?: string;
	};
	let activeSection = '';
	let additionalInfo = trip?.additionalInfo;
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
			additionalInfo: additionalInfo || null
		};
	}

	const onCancel = () => {
		additionalInfo = trip?.additionalInfo;
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
			const res = await ppatch(`trips/${trip.id}`, formData);
			if (res.ok) {
				trip = await res.json();
				tripStore.update((s) => {
					const idx = s.findIndex((t) => t.id === trip.id);
					s[idx] = trip;
					return s;
				});
				activeSection = '';
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
	data={{additionalInfo: formData.additionalInfo || ''}}
>
	<FormRow label="Additonal Info" {isEditing}>
		<div slot="value">
			{trip?.additionalInfo || ''}
		</div>
		<div slot="fields">
			<TextArea
				autofocus
				bind:value={formData.additionalInfo}
				invalid={!!formErrors?.additionalInfo}
				invalidText={formErrors?.additionalInfo}
				name="additionalInfo"
			/>
		</div>
	</FormRow>
</FormGroup>
