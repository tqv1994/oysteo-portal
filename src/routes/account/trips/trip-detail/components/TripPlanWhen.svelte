<script lang="ts">
	import { formatDate, formatOutputDatePicker } from '$lib/helpers/datetime';
	import { convertTripToInput, Trip, TRipInput } from '$lib/store/trip';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { DatePicker, DatePickerInput } from 'carbon-components-svelte';
	import { createTripService, updateTripService } from '$lib/services/trip.services';
	import { notify } from '$lib/components/Toast.svelte';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { onMount } from 'svelte';
import ODatePickerInput from '$lib/components/input/ODatePickerInput.svelte';
	export let trip: Trip | undefined;
	//export let isEditing: boolean = false;
	let activeSection = '';
	let tripInput: TRipInput;
	const onEdit = (section: string) => {
		if (trip) {
			tripInput = convertTripToInput(trip);
		} else {
			tripInput = new TRipInput();
		}
		activeSection = section;
	};

	const onCancel = () => {
		activeSection = '';
		tripInput = new TRipInput();
	};

	const onSubmit = async () => {
		isFormSavingStore.set({ saving: true });
		if (trip) {
			await updateTripService(trip.id, {
				...tripInput,
				return_at: new Date(tripInput.return_at),
				depart_at: new Date(tripInput.depart_at)
			})
				.then((output) => {
					trip = output;
				})
				.catch((error) => {
					notify({ kind: 'error', title: 'Error', subtitle: error.message });
				});
		} else {
			await createTripService({
				...tripInput,
				return_at: new Date(tripInput.return_at),
				depart_at: new Date(tripInput.depart_at)
			})
				.then((output) => {
					trip = output;
				})
				.catch((error) => {
					notify({ kind: 'error', title: 'Error', subtitle: error.message });
				});
		}
		isFormSavingStore.set({ saving: false });
		activeSection = '';
	};

	if (!trip) {
		tripInput = new TRipInput();
	} else {
		tripInput = convertTripToInput(trip);
	}

	const formatDateInput = (event: CustomEvent) => {

	}
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'trip-plan-when'}
	on:edit={() => onEdit('trip-plan-when')}
	on:cancel={onCancel}
	on:submit={onSubmit}
>
	<h6>When</h6>
	<FormRow label="Departure Date" {isEditing}>
		<div slot="value">
			{trip?.depart_at ? formatDate(trip?.depart_at) : ''}
		</div>
		<div slot="fields" style="poition: relative">
			<DatePicker
				class="fix-position"
				on:change={(e) => {
					tripInput.depart_at = e?.detail?.dateStr || '';
					if (tripInput.return_at < tripInput.depart_at) {
						tripInput.return_at = e.detail?.dateStr || '';
					}
				}}
				maxDate={tripInput.return_at}
				value={formatOutputDatePicker(trip?.depart_at)}
				datePickerType="single"
			>
				<ODatePickerInput placeholder="mm/dd/yyyy" />
			</DatePicker>
		</div>
	</FormRow>
	<FormRow label="Return Date" {isEditing}>
		<div slot="value">
			{trip?.return_at ? formatDate(trip?.return_at) : ''}
		</div>
		<div slot="fields" style="position: relative">
			<DatePicker
				on:change={(e) => {
					tripInput.return_at = e?.detail?.dateStr || '';
					if (tripInput.return_at < tripInput.depart_at) {
						tripInput.depart_at = e.detail?.dateStr || '';
					}
				}}
				minDate={tripInput.depart_at}
				value={formatOutputDatePicker(tripInput?.return_at)}
				datePickerType="single"
			>
				<ODatePickerInput placeholder="mm/dd/yyyy" />
			</DatePicker>
		</div>
	</FormRow>
</FormGroup>
