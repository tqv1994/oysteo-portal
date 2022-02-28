<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';
	import { convertTripToInput, Trip } from '$lib/store/trip';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import ListItemContainer from '$lib/components/form/listitemcontainer.svelte';
	import { Column, Grid, Row, Select, SelectItem, TextInput } from 'carbon-components-svelte';
	import type { Traveller } from '$lib/store/traveller';
	import { convertEmergencyToInput, Emergency, EmergencyInput, EmergencyTrip } from '$lib/store/emergency';
	import { beforeUpdate, onDestroy } from 'svelte';
	import { createInsuranceService, updateInsuranceService } from '$lib/services/insurance.service';
	import { formChangeStatusStore } from '$lib/store/formChangeStatus';
	import { updateTripService } from '$lib/services/trip.services';
	import { createEmergencyService, updateEmergencyService } from '$lib/services/emergency.service';
	import { convert2InternationalPhone, isValidPhoneNumber } from '$lib/helpers/phone-number';
	import type { Country } from '$lib/store/country';
	export let countries: Country[];
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	export let trip: Trip | undefined;
	export let addContactFormOpen: boolean = false;
	let emergencyInput: EmergencyInput;
	export let emergencies: EmergencyTrip[];
	//export let isEditing: boolean = false;
	let phonesInput: PhonesInput;
	type PhonesInput = {
		phone_number: string;
		phone_number_code?: string;
	};
	const onResetPhonesInput = () => {
		phonesInput = {
			phone_number: '',
			phone_number_code: '',
		};
	};
	onResetPhonesInput();
	onDestroy(() => {
		onResetPhonesInput();
	});
	let invalidPhoneNumber = {
		status: {
			phone_number: false,
		},
		message: 'Invalid phone number'
	};
	
	let activeSection = '';
	const onEdit = (section: string) => {
		activeSection = section;
		addContactFormOpen = false;
		const index = parseInt(section.replace('emergency--', ''));
		if (trip && trip.emergencies[index]) {
			emergencyInput = convertEmergencyToInput(trip.emergencies[index]);
		}

	};

	const onAdd = (section: string) => {
		if(activeSection !== 'add-emergency'){
			emergencyInput = new EmergencyInput();
			activeSection = section;
		}
	};
	const onCancel = () => {
		emergencyInput = new EmergencyInput();
		addContactFormOpen = false;
		activeSection = '';
	};

	const onSubmit = async(id?: string|number) => {
		window.openLoading(true, 'Saving');
		const phoneField = 'phone_number';
		let flag = false;
			if (!isValidPhoneNumber(phonesInput[phoneField], phonesInput[phoneField + '_code'])) {
				invalidPhoneNumber.status[phoneField] = true;
				flag = true;
			}
		if (flag) {
			setTimeout(() => {
				invalidPhoneNumber.status[phoneField] = false;
			}, INVALID_DELAY_TIME);
			return;
		}
        if(id){
            await updateEmergencyService(id, emergencyInput).then((output)=>{
                trip.emergencies = trip.emergencies.reduce((acc: Emergency[] ,item: Emergency,index) => {
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
            await createEmergencyService(emergencyInput).then(async(output)=>{
				const tripInput = convertTripToInput(trip);
				tripInput.emergencies.push(output.id);
				
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
	<FormRow label="Name" {isEditing}>
		<div slot="fields">
			<TextInput bind:value={emergencyInput.name} />
		</div>
	</FormRow>
	<FormRow label="Role" {isEditing}>
		<div slot="fields">
			<TextInput bind:value={emergencyInput.Role} />
		</div>
	</FormRow>

	<FormRow label="Phone number" {isEditing}>
		<div slot="fields" class="emergency-fields">
			<Select
				class="half-width"
				selected={emergencyInput.phoneCode}
				on:change={(e) => {
					emergencyInput.phoneCode = e.detail;
				}}
			>
				<SelectItem value="" text="Choose" />
				{#each countries as country}
					<SelectItem value={country.code} text={`${country.name} + ${country.phone}`} />
				{/each}
			</Select>
			<TextInput
				class="custom-phone-number"
				labelText=""
				placeholder=""
				bind:value={emergencyInput.numberPhone}
				invalid={invalidPhoneNumber.status.phone_number}
				invalidText={invalidPhoneNumber.message}
			/>
		</div>
		<!-- <div slot="fields">
			<TextInput bind:value={emergencyInput.numberPhone} />
		</div> -->
	</FormRow>
	<FormRow label="Reference" {isEditing}>
		<div slot="fields">
			<TextInput bind:value={emergencyInput.reference} />
		</div>
	</FormRow>
	</FormGroup>
{/if}

<FormGroup hideEditButton={true} groupClass="group fix-height">
	{#each trip?.emergencies || [] as emergency, index}
		<ListItemContainer
			let:isEditing
			reSend={false}
			isEditing={activeSection === 'emergency--' + index}
			on:edit={() => onEdit('emergency--' + index)}
			on:cancel={onCancel}
			on:submit={() => onSubmit(emergency.id)}
		>
			<FormRow label="Name" {isEditing}>
				<div slot="value">{emergency?.name || ''}</div>
				<div slot="fields">
					<TextInput bind:value={emergencyInput.name} />
				</div>
			</FormRow>
			<FormRow label="Role" {isEditing}>
				<div slot="value">{emergency?.Role || ''}</div>
				<div slot="fields">
					<TextInput bind:value={emergencyInput.Role} />
				</div>
			</FormRow>
			<FormRow label="Phone number" {isEditing}>
				<!-- <div slot="value">{emergency?.numberPhone || ''}</div> -->
				<div slot="value">
					{emergency?.numberPhone == null || emergency?.numberPhone == ''
						? ''
						: convert2InternationalPhone(emergency?.numberPhone, emergency?.phoneCode)}
				</div>
				<div slot="fields" class="emergency-fields">
					<Select
						class="half-width"
						selected={emergencyInput.phoneCode}
						on:change={(e) => {
							emergencyInput.phoneCode = e.detail;
						}}
					>
						<SelectItem value="" text="Choose" />
						{#each countries as country}
							<SelectItem value={country.code} text={`${country.name} + ${country.phone}`} />
						{/each}
					</Select>
					<TextInput
						class="custom-phone-number"
						bind:value={emergencyInput.numberPhone}
						invalid={invalidPhoneNumber.status.phone_number}
						invalidText={invalidPhoneNumber.message}
					/>
				</div>
			</FormRow>
			<FormRow label="Reference" {isEditing}>
				<div slot="value">{emergency?.reference || ''}</div>
				<div slot="fields">
					<TextInput bind:value={emergencyInput.reference} />
				</div>
			</FormRow>
		</ListItemContainer>
	{/each}
</FormGroup>
