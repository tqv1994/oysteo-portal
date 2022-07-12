<script lang="ts">
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { formatDate } from '$lib/helpers/datetime';
	import { formatNumber } from '$lib/helpers/utils';
	import type { Trip } from '$lib/store/trip';

	export let trip: Trip;

	const getDestinationsString = () => {
		if (trip?.destinations && trip.destinations.length > 0) {
			return trip.destinations.reduce((acc: string, item) => {
				if (item.name) {
					if (acc === '') {
						acc = item.name;
					} else {
						acc += ', ' + item.name;
					}
				}
				return acc;
			}, '');
		}
		return '';
	};

	const getExperiencesString = () => {
		if (trip?.experienceTypes && trip.experienceTypes.length > 0) {
			return trip.experienceTypes.reduce((acc: string, item) => {
				if (item.name) {
					if (acc === '') {
						acc = item.name;
					} else {
						acc += ', ' + item.name;
					}
				}
				return acc;
			}, '');
		}
		return '';
	};

	const getLodgingTypeString = () => {
		if (trip?.lodgingTypes && trip.lodgingTypes.length > 0) {
			return trip.lodgingTypes.reduce((acc: string, item) => {
				if (item.name) {
					if (acc === '') {
						acc = item.name;
					} else {
						acc += ', ' + item.name;
					}
				}
				return acc;
			}, trip.lodgingTypeOther || '');
		}
		return trip.lodgingTypeOther || '';
	};

	const getRoomPreferencesString = () => {
		if (trip?.roomPreferences && trip.roomPreferences.length > 0) {
			return trip.roomPreferences.reduce((acc: string, item) => {
				if (item.name) {
					if (acc === '') {
						acc = item.name;
					} else {
						acc += ', ' + item.name;
					}
				}
				return acc;
			}, '');
		}
		return '';
	};

	const getNumberOfRoom = (numberOfAdults: number, numberOfChildren: number) => {
		return Math.round((numberOfAdults + numberOfChildren) / 2);
	};
	
</script>

<FormGroup hideEditButton>
	<FormRow label="Dates">
		<div slot="value">
			{`${trip.numberOfNights || 0} nights, ${trip.depart_at ? formatDate(trip.depart_at) : ''}, ${
				trip.return_at ? formatDate(trip.return_at) : ''
			}`}
		</div>
	</FormRow>
	<FormRow label="Destinations">
		<div slot="value">{trip?.desiredDestinations ?? ''}</div>
	</FormRow>
	<FormRow label="Travelers">
		<div slot="value">
			{`${trip.numberOfAdults || 0} adults, ${trip.numberOfChildren || 0} children`}
		</div>
	</FormRow>
	<FormRow label="Room Styles">
		<div slot="value">
			{#each trip.roomStyles || [] as roomStyle}
				<!-- <img src={roomStyle.thumbnail.url}/> -->
				{roomStyle.name}
			{/each}
		</div>
	</FormRow>
	<FormRow label="Experiences">
		<div slot="value">{getExperiencesString()}</div>
	</FormRow>
	<FormRow label="Accommodation">
		<div slot="value">
			{`Lodging: ${getLodgingTypeString()}. Room Preferences: ${getRoomPreferencesString()}`}
		</div>
	</FormRow>
	<FormRow label="Flight">
		<div slot="value">
			{`${trip.needFlights ? 'Yes' : 'No'}. If yes: ${
				trip.travelByFlight || ''
			}. Travel in a different way: ${trip.travelAnotherWay || ''}`}
		</div>
	</FormRow>
	<FormRow label="Numbers of Room">
		<div slot="value">{getNumberOfRoom(trip.numberOfAdults ?? 0, trip.numberOfChildren ?? 0)}</div>
	</FormRow>
	<FormRow label="Budget">
		<div slot="value">
			{trip.currency?.code || ''}. Per Night: up to {trip?.nightlyBudget ?? 0}. Total: up to {trip?.budget ?? 0}
		</div>
	</FormRow>
	<FormRow label="Fully Vaccinated">
		<div slot="value">{trip.vaccinated ? 'Yes' : 'No'}</div>
	</FormRow>
	<FormRow label="Previous trips">
		<div slot="value">{trip.numberOfTripsInSixMonths || 0}</div>
	</FormRow>
</FormGroup>
