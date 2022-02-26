<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';
	import { convertTripToInput, Trip, TRipInput } from '$lib/store/trip';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { Column, Grid, Row, TextArea } from 'carbon-components-svelte';
	import type { Traveller } from '$lib/store/traveller';
	import type { Insurance } from '$lib/store/insurance';
	import { createTripService, updateTripService } from '$lib/services/trip.services';
	export let trip: Trip | undefined;
	let tripInput: TRipInput;
	//export let isEditing: boolean = false;
	let activeSection = '';
	let additionalInfo = '';
	const onEdit = (section: string) => {
		if (trip) {
			tripInput = convertTripToInput(trip);
		} else {
			tripInput = new TRipInput();
		}
		activeSection = section;
	}
	const onCancel = () =>{
		tripInput = new TRipInput();
		activeSection = '';
	}

	const onSubmit = async () => {
		window.openLoading(true, 'Saving');
		if (trip) {
			await updateTripService(trip.id, tripInput)
				.then((output) => {
					trip = output;
				})
				.catch((error) => {
					window.openNotification({ kind: 'error', title: 'Error', subtitle: error.message });
				});
		} else {
			await createTripService(tripInput)
				.then((output) => {
					trip = output;
				})
				.catch((error) => {
					window.openNotification({ kind: 'error', title: 'Error', subtitle: error.message });
				});
		}
		tripInput = new TRipInput();
		window.openLoading(false);
		activeSection = '';
	}
	if(!trip){
		activeSection = 'additional-info';
		tripInput = new TRipInput();
	}else{
		tripInput = convertTripToInput(trip);
	}
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'additional-info'}
	on:edit={() => onEdit('additional-info')}
	on:cancel={onCancel}
	on:submit={onSubmit}
>
	<FormRow label="Additonal Info" {isEditing}>
		<div slot="value">
			{trip?.additionalInfo || ''}
		</div>
		<div slot="fields">
			<TextArea bind:value={tripInput.additionalInfo} />
		</div>
	</FormRow>
</FormGroup>