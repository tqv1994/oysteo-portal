<script lang="ts">
	import { convert2InternationalPhone, isValidPhoneNumber } from '$lib/helpers/phone-number';
	import { session } from '$app/stores';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { ppatch } from '$lib/utils/fetch';
	import { Select, SelectItem, TextInput } from 'carbon-components-svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import { notify } from '../Toast.svelte';
	import type { Country } from '$lib/store/country';
	import { clear } from '$lib/store/activeForm';

	export let target: string;
	export let phone_number: string;
	export let cell_mobile: string;
	export let whatsapp: string;
	export let emergency: string;
	export let phone_number_code: string;
	export let cell_mobile_code: string;
	export let whatsapp_code: string;
	export let emergency_code: string;
	export let activeSection = '';
	export let countries: Country[];

	type FormData = {
		phone_number?: string;
		cell_mobile?: string;
		whatsapp?: string;
		emergency?: string;
		phone_number_code?: string;
		cell_mobile_code?: string;
		whatsapp_code?: string;
		emergency_code?: string;
	};

	type FormError = {
		phone_number?: string;
		cell_mobile?: string;
		whatsapp?: string;
		emergency?: string;
		phone_number_code?: string;
		cell_mobile_code?: string;
		whatsapp_code?: string;
		emergency_code?: string;
	};

	const dispatch = createEventDispatcher();

	let formErrors: FormError;
	let formData: FormData = reset();

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	function reset() {
		return {
			phone_number: phone_number || '',
			cell_mobile: cell_mobile || '',
			whatsapp: whatsapp || '',
			emergency: emergency || '',
			phone_number_code: phone_number_code || '',
			cell_mobile_code: cell_mobile_code || '',
			whatsapp_code: whatsapp_code || '',
			emergency_code: emergency_code || ''
		};
	}

	onMount(reset);
	onDestroy(reset);

	function validatePhoneNumber(field: string, label: string, errors: FormError) {
		const codeField = field + '_code';
		const num = formData[field];
		const country = formData[codeField];
		if ((num || country) && (!(num && country) || !isValidPhoneNumber(num, country))) {
			if (!country) {
				errors[codeField] = `${label} country code is invalid`;
			} else {
				errors[field] = `${label} number is invalid`;
			}
		}
	}

	async function onSubmit() {
		const errors: FormError = {};
		for (const k in formData) {
			if (formData.hasOwnProperty(k)) {
				const value = formData[k];
				if (value.length) {
					formData[k] = value.trim();
				}
			}
		}
		validatePhoneNumber('phone_number', 'Phone', errors);
		validatePhoneNumber('cell_mobile', 'Cell/Mobile', errors);
		validatePhoneNumber('whatsapp', 'WhatsApp', errors);
		validatePhoneNumber('emergency', 'Emergency phone', errors);

		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}

		isFormSavingStore.set({ saving: true });
		try {
			const res = await ppatch(target, {
				...formData,
				phone_number: formData.phone_number + '',
				cell_mobile: formData.cell_mobile + '',
				whatsapp: formData.whatsapp + '',
				emergency: formData.emergency + ''
			});
			if (res.ok) {
				dispatch('change', await res.json());
				activeSection = '';
				session.update((s) => {
					if (target == 'advisors/me') {
						s.advisorMe.phone_number = formData.phone_number;
						s.advisorMe.cell_mobile = formData.cell_mobile;
						s.advisorMe.whatsapp = formData.whatsapp;
						s.advisorMe.emergency = formData.emergency;
					} else {
						s.agencyMe.phone_number = formData.phone_number;
						s.agencyMe.cell_mobile = formData.cell_mobile;
						s.agencyMe.whatsapp = formData.whatsapp;
						s.agencyMe.emergency = formData.emergency;
					}
					return s;
				});
				clear();
			} else {
				notify({
					title: 'Update failed',
					subtitle: 'Failed to update information, please try again later.'
				});
			}
		} catch (error) {
			notify({
				title: 'Update failed',
				subtitle: 'Failed to update information, please try again later.'
			});
			console.error('Failed to update phone numbers', error);
		}
		isFormSavingStore.set({ saving: false });
	}
</script>

<FormGroup let:isEditing on:submit={onSubmit} on:cancel={reset} data={{ ...formData }}>
	<FormRow label="Phone number" {isEditing}>
		<div slot="value">
			{phone_number == null || phone_number == ''
				? ''
				: convert2InternationalPhone(phone_number, phone_number_code)}
		</div>
		<div slot="fields" class="contact-fields">
			<Select
				labelText="Country Code"
				class="half-width"
				selected={formData.phone_number_code}
				on:change={(e) => {
					formData.phone_number_code = e.detail;
				}}
				invalid={!!formErrors?.phone_number_code}
				invalidText={formErrors?.phone_number_code}
				name="phone_number_code"
			>
				<SelectItem value="" text="Choose" />
				{#each countries as country}
					<SelectItem value={country.code} text={`${country.name} + ${country.phone}`} />
				{/each}
			</Select>
			<TextInput
				autofocus
				type="text"
				labelText="Number"
				placeholder="Enter your phone number"
				bind:value={formData.phone_number}
				invalid={!!formErrors?.phone_number}
				invalidText={formErrors?.phone_number}
				name="phone_number"
			/>
		</div>
	</FormRow>
	<FormRow label="Cell/Mobile" {isEditing}>
		<div slot="value">
			{cell_mobile == null || cell_mobile == ''
				? ''
				: convert2InternationalPhone(cell_mobile, cell_mobile_code)}
		</div>
		<div slot="fields" class="contact-fields">
			<Select
				labelText="Country Code"
				class="half-width"
				selected={formData.cell_mobile_code}
				on:change={(e) => {
					formData.cell_mobile_code = e.detail;
				}}
				invalid={!!formErrors?.cell_mobile_code}
				invalidText={formErrors?.cell_mobile_code}
				name="cell_mobile_code"
			>
				<SelectItem value="" text="Choose" />
				{#each countries as country}
					<SelectItem value={country.code} text={`${country.name} + ${country.phone}`} />
				{/each}
			</Select>
			<TextInput
				type="text"
				labelText="Number"
				placeholder="Enter cell/mobile number"
				bind:value={formData.cell_mobile}
				invalid={!!formErrors?.cell_mobile}
				invalidText={formErrors?.cell_mobile}
				name="cell_mobile"
			/>
		</div>
	</FormRow>
	<FormRow label="WhatsApp" {isEditing}>
		<div slot="value">
			{convert2InternationalPhone(whatsapp, whatsapp_code)}
		</div>
		<div slot="fields" class="contact-fields">
			<Select
				labelText="Country Code"
				class="half-width"
				selected={formData.whatsapp_code}
				on:change={(e) => {
					formData.whatsapp_code = e.detail;
				}}
				invalid={!!formErrors?.whatsapp_code}
				invalidText={formErrors?.whatsapp_code}
				name="whatsapp_code"
			>
				<SelectItem value="" text="Choose" />
				{#each countries as country}
					<SelectItem value={country.code} text={`${country.name} + ${country.phone}`} />
				{/each}
			</Select>
			<TextInput
				type="text"
				labelText="Number"
				placeholder="Enter your WhatsApp number"
				bind:value={formData.whatsapp}
				invalid={!!formErrors?.whatsapp}
				invalidText={formErrors?.whatsapp}
				name="whatsapp"
			/>
		</div>
	</FormRow>
	<FormRow label="Emergency -24hrs" {isEditing}>
		<div slot="value">
			{emergency == null || emergency == ''
				? ''
				: convert2InternationalPhone(emergency, emergency_code)}
		</div>
		<div slot="fields" class="contact-fields">
			<Select
				labelText="Country Code"
				class="half-width"
				selected={formData.emergency_code}
				on:change={(e) => {
					formData.emergency_code = e.detail;
				}}
				invalid={!!formErrors?.emergency_code}
				invalidText={formErrors?.emergency_code}
				name="emergency_code"
			>
				<SelectItem value="" text="Choose" />
				{#each countries as country}
					<SelectItem value={country.code} text={`${country.name} + ${country.phone}`} />
				{/each}
			</Select>
			<TextInput
				type="text"
				labelText="Number"
				placeholder="Enter your emergency contact number"
				bind:value={formData.emergency}
				invalid={!!formErrors?.emergency}
				invalidText={formErrors?.emergency}
				name="emergency"
			/>
		</div>
	</FormRow>
</FormGroup>
