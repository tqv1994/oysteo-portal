<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';
	import { convertTripToInput, Trip, TRipInput } from '$lib/store/trip';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { TextInput } from 'carbon-components-svelte';
	import type { convertInsuranceToInput, Insurance, InsuranceInput } from '$lib/store/insurance';
	import { createTripService, updateTripService } from '$lib/services/trip.services';
	export let trip: Trip | undefined;
	let tripInput: TRipInput;
	let insuranceInput: InsuranceInput;
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

	

	if(!trip){
		activeSection = 'emergency-info';
		tripInput = new TRipInput();
	}else{
		tripInput = convertTripToInput(trip);
	}
</script>

<FormGroup
	groupClass = 'custom-group group'
	let:isEditing
	isEditing={activeSection === 'emergency-info'}
	on:edit={() => onEdit('emergency-info')}
	on:cancel={onCancel}
	on:submit={onSubmit}
>
	<FormRow label="Insurance Policy" {isEditing}>
		<div slot="value">{trip?.policyId || '' }</div>
		<div slot="fields">
			<TextInput bind:value={tripInput.policyId} />
		</div>
	</FormRow>
	<FormRow label="Contact" {isEditing}>
		<div slot="value">{trip?.contact || '' }</div>
		<div slot="fields">
			<TextInput bind:value={tripInput.contact} />
		</div>
	</FormRow>
	<FormRow label="Website" {isEditing}>
		<div slot="value">{trip?.website || '' }</div>
		<div slot="fields">
			<TextInput bind:value={tripInput.website} />
		</div>
	</FormRow>
</FormGroup>