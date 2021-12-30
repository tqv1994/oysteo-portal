<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';
	import { convertTripToInput, Trip } from '$lib/store/trip';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import ListItemContainer from '$lib/components/form/listitemcontainer.svelte';
	import { Column, Grid, Row, TextInput } from 'carbon-components-svelte';
	import type { Traveller } from '$lib/store/traveller';
	import type { Emergency, EmergencyInput } from '$lib/store/emergency';
	import { convertInsuranceToInput, Insurance, InsuranceInput } from '$lib/store/insurance';
	import { beforeUpdate } from 'svelte';
	import { createInsuranceService, updateInsuranceService } from '$lib/services/insurance.service';
import { formChangeStatusStore } from '$lib/store/formChangeStatus';
import { updateTripService } from '$lib/services/trip.services';
	export let trip: Trip | undefined;
	export let addContactFormOpen: boolean = false;
	let insuranceInput: InsuranceInput;
	//export let isEditing: boolean = false;
	let activeSection = '';
	const onEdit = (section: string) => {
		activeSection = section;
		addContactFormOpen = false;
		const index = parseInt(section.replace('emergency--', ''));
		console.log('index', index);
		if (trip && trip.insurances[index]) {
			insuranceInput = convertInsuranceToInput(trip.insurances[index]);
		}
	};
	const onAdd = (section: string) => {
		if(activeSection !== 'add-emergency'){
			insuranceInput = new InsuranceInput();
			activeSection = section;
		}
	};
	const onCancel = () => {
		insuranceInput = new InsuranceInput();
		addContactFormOpen = false;
		activeSection = '';
	};

	const onSubmit = async(id?: string|number) => {
		window.openLoading(true, 'Saving');
        if(id){
            await updateInsuranceService(id, insuranceInput).then((output)=>{
                trip.insurances = trip.insurances.reduce((acc: Insurance[] ,item: Insurance,index) => {
					if(item.id === id){
						acc[index] = output;
					}else{
						acc[index] = item;
					}
					return acc;
				},[]);
            }).catch((error)=>{
                window.openNotification({kind:'error',title: 'Error',subtitle: error.message});
            });
        }else{
            await createInsuranceService(insuranceInput).then(async(output)=>{
				const tripInput = convertTripToInput(trip);
				tripInput.insurances.push(output.id);
				await updateTripService(trip.id,{...tripInput}).then((tripOutput)=>{
					trip = tripOutput;
				});
            }).catch((error)=>{
                window.openNotification({kind:'error',title: 'Error',subtitle: error.message});
            });
        }
		window.openLoading(false);
		onCancel();
		formChangeStatusStore.set({ changing: false });
	};

	beforeUpdate(() => {
		if (addContactFormOpen) {
			onAdd('add-emergency');
		}
	});
</script>

{#if addContactFormOpen}
	<FormGroup
		let:isEditing
		isEditing={activeSection === 'add-emergency'}
		on:edit={() => onAdd('add-emergency')}
		on:cancel={onCancel}
		on:submit={()=>onSubmit()}
	>
		<FormRow label="Insurance Police" {isEditing}>
			<div slot="fields">
				<TextInput bind:value={insuranceInput.policyId} />
			</div>
		</FormRow>
		<FormRow label="Contact" {isEditing}>
			<div slot="fields">
				<TextInput bind:value={insuranceInput.contact} />
			</div>
		</FormRow>
		<FormRow label="Website" {isEditing}>
			<div slot="fields">
				<TextInput bind:value={insuranceInput.website} />
			</div>
		</FormRow>
	</FormGroup>
{/if}

<FormGroup hideEditButton={true}>
	{#each trip?.insurances || [] as insurance, index}
		<ListItemContainer
			let:isEditing
			isEditing={activeSection === 'emergency--' + index}
			on:edit={() => onEdit('emergency--' + index)}
			on:cancel={onCancel}
			on:submit={() => onSubmit(insurance.id)}
		>
			<FormRow label="Insurance Police" {isEditing}>
				<div slot="value">{insurance?.policyId || ''}</div>
				<div slot="fields">
					<TextInput bind:value={insuranceInput.policyId} />
				</div>
			</FormRow>
			<FormRow label="Start Date" {isEditing}>
				<div slot="value">{formatDate(insurance?.published_at)}</div>
				<div slot="fields">
					<TextInput value={formatDate(insurance.published_at)}  disabled/>
				</div>
			</FormRow>
			<FormRow label="Contact" {isEditing}>
				<div slot="value">{insurance?.contact || ''}</div>
				<div slot="fields">
					<TextInput bind:value={insuranceInput.contact} />
				</div>
			</FormRow>
			<FormRow label="Website" {isEditing}>
				<div slot="value">{insurance?.website || ''}</div>
				<div slot="fields">
					<TextInput bind:value={insuranceInput.website} />
				</div>
			</FormRow>
		</ListItemContainer>
	{/each}
</FormGroup>
