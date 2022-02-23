<script lang="ts">
	import { formatDate, formatOutputDatePicker } from '$lib/helpers/datetime';
	import { convertTripToInput, Trip, TRipInput } from '$lib/store/trip';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { Column, DatePicker, DatePickerInput, Grid, Row } from 'carbon-components-svelte';
	import type { Traveller } from '$lib/store/traveller';
	import { createTripService, updateTripService } from '$lib/services/trip.services';
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
		window.openLoading(true, 'Saving');
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
					window.openNotification({ kind: 'error', title: 'Error', subtitle: error.message });
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
					window.openNotification({ kind: 'error', title: 'Error', subtitle: error.message });
				});
		}
		window.openLoading(false);
		activeSection = '';
	};
	if(!trip){
		activeSection = 'trip-plan-when';
		tripInput = new TRipInput();
	}else{
		tripInput = convertTripToInput(trip);
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
				on:change={(e) => {
					console.log(e.detail);
					tripInput.depart_at = e.detail?.dateStr || '';
				}}
				value={formatOutputDatePicker(tripInput.depart_at)}
				datePickerType="single"
			>
				<DatePickerInput placeholder="mm/dd/yyyy" />
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
					console.log(e.detail);
					tripInput.return_at = e.detail?.dateStr || '';
				}}
				value={formatOutputDatePicker(tripInput.return_at)}
				datePickerType="single"
			>
				<DatePickerInput placeholder="mm/dd/yyyy" />
			</DatePicker>
		</div>
	</FormRow>
</FormGroup>
