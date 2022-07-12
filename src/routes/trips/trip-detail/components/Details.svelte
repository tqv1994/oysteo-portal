<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';
	import {
		type Trip,
		TRipInput,
		tripStore
	} from '$lib/store/trip';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { TextArea } from 'carbon-components-svelte';
	import { createTripService, updateTripService } from '$lib/services/trip.services';
	import { notify } from '$lib/components/Toast.svelte';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { ppatch, ppost } from '$lib/utils/fetch';
	import { clear } from '$lib/store/activeForm';
	export let trip: Trip | undefined;
	//export let isEditing: boolean = false;
	type FormData = {
		description?: string;
		note?: string;
	};
	type FormError = {
		description?: string;
		note?: string;
	};
	let activeSection = '';
	let description: string = trip?.description;
	let note: string = trip?.note;
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
			description: description || null,
			note: note || null
		};
	}

	const onCancel = () => {
		activeSection = '';
	};

	const onSubmit = async () => {
		const errors: FormError = {};

		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}
		isFormSavingStore.set({ saving: true });
		try {
			if (trip) {
				const res = await ppatch(`trips/${trip.id}`, formData);
				if (res.ok) {
					trip = await res.json();
					tripStore.update((s) => {
						const idx = s.findIndex((t) => t.id === trip.id);
						s[idx] = trip;
						return s;
					});
					clear();
				} else {
					notify({
						title: 'Update failed',
						subtitle: 'Failed to update information, please try again later.'
					});
				}
			} else {
				const res = await ppost(`trips`, formData);
				if (res.ok) {
					const tripOutput = await res.json();
					activeSection = '';
					clear();
				} else {
					notify({
						title: 'Create failed',
						subtitle: 'Failed to create information, please try again later.'
					});
				}
			}
		} catch (error) {
			notify({
				title: 'Update failed',
				subtitle: 'Failed to update information, please try again later.'
			});
			console.error('Failed to update business insurance', error);
		}
		activeSection = '';
		isFormSavingStore.set({ saving: false });
	};
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'details'}
	on:cancel={onCancel}
	on:submit={onSubmit}
	data={{ description: formData.description || '', note: formData.note || '' }}
>
	<FormRow label="Description" {isEditing}>
		<div slot="value">
			{trip?.description || ''}
		</div>
		<div slot="fields">
			<TextArea
				autofocus
				bind:value={formData.description}
				invalid={!!formErrors?.description}
				invalidText={formErrors?.description}
				name="description"
			/>
		</div>
	</FormRow>
	<FormRow label="Notes" {isEditing}>
		<div slot="value">
			{trip?.note || ''}
		</div>
		<div slot="fields">
			<TextArea
				bind:value={formData.note}
				invalid={!!formErrors?.note}
				invalidText={formErrors?.note}
				name="note"
			/>
		</div>
	</FormRow>
</FormGroup>
