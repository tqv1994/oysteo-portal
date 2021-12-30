<script lang="ts">
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
import { dateDiffInDays, formatDate } from '$lib/helpers/datetime';
    import { getDatesTrip, getTravellersString, Trip } from '$lib/store/trip';
	export let trip: Trip;
</script>

<FormGroup hideEditButton>
	<FormRow label="Dates">
		<div slot="value">${getDatesTrip(trip)}</div>
	</FormRow>
    <FormRow label="Destinations">
		<div slot="value"></div>
	</FormRow>
    <FormRow label="Travelers">
		<div slot="value">{getTravellersString(trip)}</div>
	</FormRow>
    <FormRow label="Style">
		<div slot="value"></div>
	</FormRow>
    <FormRow label="Experiences">
		<div slot="value"></div>
	</FormRow>
    <FormRow label="Accommodation">
		<div slot="value"></div>
	</FormRow>
    <FormRow label="Flight">
		<div slot="value"></div>
	</FormRow>
    <FormRow label="Budget">
		<div slot="value">USD. Per Night: {trip.budget || ''}. Total: {trip.budget ? (trip.budget * dateDiffInDays(trip.depart_at, trip.return_at)) : ''}</div>
	</FormRow>
    <FormRow label="Fully Vaccinated">
		<div slot="value">{trip.vaccinated ? 'Yes' : 'No'}</div>
	</FormRow>
    <FormRow label="Previous trips">
		<div slot="value"></div>
	</FormRow>
</FormGroup>
