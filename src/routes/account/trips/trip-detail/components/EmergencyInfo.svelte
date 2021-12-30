<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';
	import { convertTripToInput, Trip, TRipInput } from '$lib/store/trip';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { TextInput } from 'carbon-components-svelte';
	import type { Insurance } from '$lib/store/insurance';
	import { createTripService, updateTripService } from '$lib/services/trip.services';
	export let trip: Trip | undefined;
	let tripInput: TRipInput;
	let activeSection = ''; 
	const onEdit = (section: string) => {
		if(trip){
			tripInput = convertTripToInput(trip);
		}else{
			tripInput = new TRipInput();
		}
		activeSection = section;
	}
	const onCancel = () =>{
		tripInput = new TRipInput();
		activeSection = '';
	}

	const onSubmit = async() => {
		window.openLoading(true, 'Saving');
        if(trip){
            await updateTripService(trip.id, tripInput).then((output)=>{
                trip = output;
            }).catch((error)=>{
                window.openNotification({kind:'error',title: 'Error',subtitle: error.message});
            });
        }else{
            await createTripService(tripInput).then((output)=>{
                trip = output;
            }).catch((error)=>{
                window.openNotification({kind:'error',title: 'Error',subtitle: error.message});
            });
        }
		window.openLoading(false);
		onCancel();
	}
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'emergency-info'}
	on:edit={() => onEdit('emergency-info')}
	on:cancel={onCancel}
	on:submit={onSubmit}
>
	<FormRow label="Name" {isEditing}>
		<div slot="value">{trip?.emergencyName || '' }</div>
		<div slot="fields">
			<TextInput bind:value={tripInput.emergencyName} />
		</div>
	</FormRow>
	<FormRow label="Role / Purpose" {isEditing}>
        <div slot="value">{trip?.emergencyRole || ''}</div>
		<div slot="fields">
			<TextInput bind:value={tripInput.emergencyRole} />
        </div>
	</FormRow>
    <FormRow label="Number" {isEditing}>
        <div slot="value">{trip?.emergencyPhone || ''}</div>
		<div slot="fields">
			<TextInput bind:value={tripInput.emergencyPhone} />
        </div>
	</FormRow>
	<FormRow label="Reference #" {isEditing}>
        <div slot="value">{trip?.emergencyReference || ''}</div>
		<div slot="fields">
			<TextInput bind:value={tripInput.emergencyReference} />
        </div>
	</FormRow>
</FormGroup>