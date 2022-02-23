<script lang="ts">
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
import { dateDiffInDays, formatDate } from '$lib/helpers/datetime';
import { formatNumber } from '$lib/helpers/utils';
    import type { Trip } from '$lib/store/trip';
	export let trip: Trip;
	const getDestinationsString = () => {
		if(trip.destinationTypes.length > 0){
			return trip.destinationTypes.reduce((acc: string, item)=>{
				if(item.name){
					if(acc === ''){
						acc = item.name;
					}else{
						acc += ', '+item.name;
					}
				}
				return acc;
			},'');
		}
		return '';
	}

	const getExperiencesString = () => {
		if(trip.experiences.length > 0){
			return trip.experiences.reduce((acc: string, item)=>{
				if(item.name){
					if(acc === ''){
						acc = item.name;
					}else{
						acc += ', '+item.name;
					}
				}
				return acc;
			},'');
		}
		return '';
	}

	const getLodgingTypeString = () => {
		if(trip.lodgingTypes.length > 0){
			return trip.lodgingTypes.reduce((acc: string, item)=>{
				if(item.name){
					if(acc === ''){
						acc = item.name;
					}else{
						acc += ', '+item.name;
					}
				}
				return acc;
			},trip.lodgingTypeOther || '');
		}
		return trip.lodgingTypeOther || '';
	}

	const getRoomPreferencesString = () => {
		if(trip.roomPreferences.length > 0){
			return trip.roomPreferences.reduce((acc: string, item)=>{
				if(item.name){
					if(acc === ''){
						acc = item.name;
					}else{
						acc += ', '+item.name;
					}
				}
				return acc;
			},'');
		}
		return '';
	}
</script>

<FormGroup hideEditButton>
	<FormRow label="Dates">
		<div slot="value">{`${trip.numberOfNights || 0} nights, ${trip.depart_at ? formatDate(trip.depart_at) : ''}, ${trip.return_at ? formatDate(trip.return_at) : ''}`}</div>
	</FormRow>
    <FormRow label="Destinations">
		<div slot="value">{getDestinationsString()}</div>
	</FormRow>
    <FormRow label="Travelers">
		<div slot="value">{`${trip.numberOfAdults || 0} adults, ${trip.numberOfChildren || 0} children`}</div>
	</FormRow>
    <FormRow label="Room Styles">
		<div slot="value">
			<div class="row">
				{#each trip.roomStyles as roomStyle}
					<div class="d-col-4 m-col-6">
						<!-- <img src={roomStyle.thumbnail.url}/> -->
					</div>
				{/each}
			</div>
			
		</div>
	</FormRow>
    <FormRow label="Experiences">
		<div slot="value">{getExperiencesString()}</div>
	</FormRow>
    <FormRow label="Accommodation">
		<div slot="value">{`Lodging: ${getLodgingTypeString()}. Room Preferences: ${getRoomPreferencesString()}`}</div>
	</FormRow>
    <FormRow label="Flight">
		<div slot="value">
			{`${trip.needFlights ? 'Yes' : 'No'}. If yes: ${trip.travelByFlight || ''}. Travel in a different way: ${trip.travelAnotherWay || ''}`}
		</div>
	</FormRow>
	<FormRow label="Numbers of Room">
		<div slot="value">{trip.numberOfRoom}</div>
	</FormRow>
    <FormRow label="Budget">
		<div slot="value">{trip.currency?.code || ''}. Per Night: {trip.budget ? formatNumber(trip.budget/trip.numberOfRoom/trip.numberOfNights) : ''}. Total: {trip.budget ? formatNumber(trip.budget) : ''}</div>
	</FormRow>
    <FormRow label="Fully Vaccinated">
		<div slot="value">{trip.vaccinated ? 'Yes' : 'No'}</div>
	</FormRow>
    <FormRow label="Previous trips">
		<div slot="value">{trip.numberOfTripsInSixMonths || 0}</div>
	</FormRow>
</FormGroup>
<style lang="scss">
	@use '../../../../../styles/grid';
</style>
