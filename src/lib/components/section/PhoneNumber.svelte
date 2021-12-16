<script lang="ts">
	import {
		convert2InternationalPhone,
		convert2NationalPhone,
		isValidPhoneNumber
	} from '$lib/helpers/phone-number';

	import type { Advisor } from '$lib/store/advisor';
	import type { Agency } from '$lib/store/agency';
	import type { Country } from '$lib/store/country';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { Select, SelectItem, TextInput } from 'carbon-components-svelte';
	import { onDestroy, onMount } from 'svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';

	export let object: Advisor | Agency;
	export let countries: Country[];
	export let activeSection: string = '';
	export let activeLoading: boolean = false;
	export let type: string;
	type PhonesInput = {
		phone_number: string;
		cell_mobile: string;
		whatsapp: string;
		emergency: string;
		phone_number_code?: string;
		cell_mobile_code?: string;
		whatsapp_code?: string;
		emergency_code?: string;
	};
	let phonesInput: PhonesInput;

	const onResetPhonesInput = () => {
		phonesInput = {
			phone_number: '',
			cell_mobile: '',
			whatsapp: '',
			emergency: '',
			phone_number_code: '',
			cell_mobile_code: '',
			whatsapp_code: '',
			emergency_code: ''
		};
	};

	onResetPhonesInput();

	onDestroy(() => {
		onResetPhonesInput();
	});

	const onEdit = (groupName: string) => {
		phonesInput.phone_number = convert2NationalPhone(object.phone_number, object.phone_number_code);
		phonesInput.cell_mobile = convert2NationalPhone(object.cell_mobile, object.cell_mobile_code);
		phonesInput.whatsapp = convert2NationalPhone(object.whatsapp, object.whatsapp_code);
		phonesInput.emergency = convert2NationalPhone(object.emergency, object.emergency_code);
		phonesInput.phone_number_code = object.phone_number_code || '';
		phonesInput.cell_mobile_code = object.cell_mobile_code || '';
		phonesInput.whatsapp_code = object.cell_mobile_code || '';
		phonesInput.emergency_code = object.emergency_code || '';
		activeSection = groupName;
	};
	const onCancel = () => {
		activeSection = '';
	};

	let invalidPhoneNumber = {
		status: {
			phone_number: false,
			cell_mobile: false,
			whatsapp: false,
			emergency: false
		},
		message: 'Invalid phone number'
	};
	const updatePhoneNumber = async () => {
		try {
			const phoneField = ['phone_number', 'cell_mobile', 'whatsapp', 'emergency'];
			let flag = false;
			phoneField.forEach((field) => {
				if (!isValidPhoneNumber(phonesInput[field], phonesInput[field + '_code'])) {
					invalidPhoneNumber.status[field] = true;
					flag = true;
				}
			});
			if (flag) {
				setTimeout(() => {
					phoneField.forEach((field) => {
						invalidPhoneNumber.status[field] = false;
					});
				}, INVALID_DELAY_TIME);
				return;
			}

			activeLoading = true;
			const res = await fetch(`/common/${type}-${object.id}.json`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...phonesInput })
			});
			if (res.ok) {
				object.phone_number = phonesInput.phone_number;
				object.cell_mobile = phonesInput.cell_mobile;
				object.whatsapp = phonesInput.whatsapp;
				object.emergency = phonesInput.emergency;
				object.phone_number_code = phonesInput.phone_number_code || '';
				object.cell_mobile_code = phonesInput.cell_mobile_code || '';
				object.whatsapp_code = phonesInput.cell_mobile_code || '';
				object.emergency_code = phonesInput.emergency_code || '';
					window.openNotification({
					kind: 'success',
					title: 'Success',
					subtitle: 'Update successfully'
				});
				onResetPhonesInput();
				activeSection = '';
			}
		} catch (error) {
			window.openNotification({
				kind: 'error',
				title: 'Error',
				subtitle: error.message
			});
			console.log('Update Phone Number : ' + error);
		}
		activeLoading = false;
	};
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'phone'}
	on:edit={() => onEdit('phone')}
	on:cancel={onCancel}
	on:submit={updatePhoneNumber}
>
	<FormRow label="Phone Number" {isEditing}>
		<div slot="value">
			{object.phone_number == null || object.phone_number == ''
				? ''
				: convert2InternationalPhone(object.phone_number, object.phone_number_code)}
		</div>
		<div slot="fields" class="contact-fields">
			<Select
				labelText="Country Code"
				class="half-width"
				selected={phonesInput.phone_number_code}
				on:change={(e) => {
					phonesInput.phone_number_code = e.detail;
				}}
			>
				<SelectItem value="" text="Choose ..." />
				{#each countries as country}
					<SelectItem value={country.code} text={`+${country.phone} - ${country.name}`} />
				{/each}
			</Select>
			<TextInput
				labelText="Number"
				placeholder="Enter your phone number..."
				bind:value={phonesInput.phone_number}
				invalid={invalidPhoneNumber.status.phone_number}
				invalidText={invalidPhoneNumber.message}
				type="number"
			/>
		</div>
	</FormRow>
	<FormRow label="Cell/Mobile" {isEditing}>
		<div slot="value">
			{object.cell_mobile == null || object.cell_mobile == ''
				? ''
				: convert2InternationalPhone(object.cell_mobile, object.cell_mobile_code)}
		</div>
		<div slot="fields" class="contact-fields">
			<Select
				labelText="Country Code"
				class="half-width"
				selected={phonesInput.cell_mobile_code}
				on:change={(e) => {
					phonesInput.cell_mobile_code = e.detail;
				}}
			>
				<SelectItem value="" text="Choose ..." />
				{#each countries as country}
					<SelectItem value={country.code} text={`+${country.phone} - ${country.name}`} />
				{/each}
			</Select>
			<TextInput
				labelText="Number"
				placeholder="Enter cell/mobile number..."
				bind:value={phonesInput.cell_mobile}
				invalid={invalidPhoneNumber.status.cell_mobile}
				invalidText={invalidPhoneNumber.message}
				type="number"
			/>
		</div>
	</FormRow>
	<FormRow label="WhatsApp" {isEditing}>
		<div slot="value">
			{object.whatsapp == null || object.whatsapp == ''
				? ''
				: convert2InternationalPhone(object.whatsapp, object.whatsapp_code)}
		</div>
		<div slot="fields" class="contact-fields">
			<Select
				labelText="Country Code"
				class="half-width"
				selected={phonesInput.whatsapp_code}
				on:change={(e) => {
					phonesInput.whatsapp_code = e.detail;
				}}
			>
				<SelectItem value="" text="Choose ..." />
				{#each countries as country}
					<SelectItem value={country.code} text={`+${country.phone} - ${country.name}`} />
				{/each}
			</Select>
			<TextInput
				labelText="Number"
				placeholder="Enter your WhatsApp number..."
				bind:value={phonesInput.whatsapp}
				invalid={invalidPhoneNumber.status.whatsapp}
				invalidText={invalidPhoneNumber.message}
				type="number"
			/>
		</div>
	</FormRow>
	<FormRow label="Emergency -24hrs" {isEditing}>
		<div slot="value">
			{object.emergency == null || object.emergency == ''
				? ''
				: convert2InternationalPhone(object.emergency, object.emergency_code)}
		</div>
		<div slot="fields" class="contact-fields">
			<Select
				labelText="Country Code"
				class="half-width"
				selected={phonesInput.emergency_code}
				on:change={(e) => {
					phonesInput.emergency_code = e.detail;
				}}
			>
				<SelectItem value="" text="Choose ..." />
				{#each countries as country}
					<SelectItem value={country.code} text={`+${country.phone} - ${country.name}`} />
				{/each}
			</Select>
			<TextInput
				labelText="Number"
				placeholder="Enter your emergency contact number..."
				bind:value={phonesInput.emergency}
				invalid={invalidPhoneNumber.status.emergency}
				invalidText={invalidPhoneNumber.message}
				type="number"
			/>
		</div>
	</FormRow>
</FormGroup>
