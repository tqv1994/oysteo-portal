<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';
	import { convertTripToInput, Trip, TRipInput } from '$lib/store/trip';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { TextArea } from 'carbon-components-svelte';
	import { createTripService, updateTripService } from '$lib/services/trip.services';
	import { notify } from '$lib/components/Toast.svelte';
import { isFormSavingStore } from '$lib/store/isFormSaving';
	export let trip: Trip | undefined;
	//export let isEditing: boolean = false;
	let activeSection = '';
	let tripInput: TRipInput;
	let activeLoading: boolean;
	const onEdit = (section: string) => {
		if (trip) {
			tripInput = convertTripToInput(trip);
		} else {
			tripInput = new TRipInput();
		}
		activeSection = section;
	};
	const onCancel = () => {
		tripInput = new TRipInput();
		activeSection = '';
	};

	const onSubmit = async () => {
		isFormSavingStore.set({saving: true});
		if (trip) {
			await updateTripService(trip.id, tripInput)
				.then((output) => {
					trip = output;
				})
				.catch((error) => {
					notify({ kind: 'error', title: 'Error', subtitle: error.message });
				});
		} else {
			await createTripService(tripInput)
				.then((output) => {
					trip = output;
				})
				.catch((error) => {
					notify({ kind: 'error', title: 'Error', subtitle: error.message });
				});
		}
		tripInput = new TRipInput();
		isFormSavingStore.set({saving: false});
		activeSection = '';
	};
	if (!trip) {
		activeSection = 'details';
		tripInput = new TRipInput();
	} else {
		tripInput = convertTripToInput(trip);
	}
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'details'}
	on:edit={() => onEdit('details')}
	on:cancel={onCancel}
	on:submit={onSubmit}
>
	<FormRow label="Description" {isEditing}>
		<div slot="value">
			{trip?.description || ''}
		</div>
		<div slot="fields">
			<TextArea autofocus bind:value={tripInput.description} />
		</div>
	</FormRow>
	<FormRow label="Notes" {isEditing}>
		<div slot="value">
			{trip?.note || ''}
		</div>
		<div slot="fields">
			<TextArea bind:value={tripInput.note} />
		</div>
	</FormRow>
</FormGroup>
