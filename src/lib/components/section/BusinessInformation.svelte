<script lang="ts">
	import {
		reformatDateToEn,
		reformatDateToIso,
		reformatDateToMonthYear,
		isValidDateString,
		toIsoString
	} from '$lib/helpers/datetime';
	import {} from '$lib/helpers/utils';

	import type { Agency } from '$lib/store/agency';
	import { session } from '$app/stores';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import type { DatePickerDate, DatePickerEvent } from '$lib/store/types';
	import { INVALID_DELAY_TIME, TIME_ZONES } from '$lib/utils/constants';
	import { ppatch } from '$lib/utils/fetch';
	import {
		DatePicker,
		DatePickerInput,
		Select,
		SelectItem,
		TextInput
	} from 'carbon-components-svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import { notify } from '../Toast.svelte';
	import { clear } from '$lib/store/activeForm';

	export let target: string;
	export let agency: Agency;
	export let activeSection = '';

	type FormData = {
		legalName: string;
		registrationId: string;
		taxId: string;
		timezone: string;
		established_at: string | null;
	};

	type FormError = {
		legalName?: string;
		established_at?: string;
	};

	$: timezone = TIME_ZONES.find((z) => {
		return z.locale == agency.timezone;
	});

	const dispatch = createEventDispatcher();

	let formData: FormData;
	let formErrors: FormError;

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	function reset() {
		formData = {
			legalName: agency.legalName || '',
			registrationId: agency.registrationId || '',
			taxId: agency.taxId || '',
			timezone: agency.timezone || '',
			established_at: reformatDateToEn(agency.established_at)
		};
	}

	onMount(reset);
	onDestroy(reset);

	const onSubmit = async () => {
		const errors: FormError = {};
		if (!formData.legalName) {
			errors.legalName = "Your business' legal name is required";
		}
		if (!isValidDateString(formData.established_at)) {
			errors.established_at = 'Established date is required';
		}
		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}

		isFormSavingStore.set({ saving: true });
		try {
			const res = await ppatch(target, {
				...formData,
				established_at: reformatDateToIso(formData.established_at)
			});
			if (res.ok) {
				dispatch('change', await res.json());
				activeSection = '';
				session.update((s) => {
					s.agencyMe.legalName = formData.legalName;
					s.agencyMe.registrationId = formData.registrationId;
					s.agencyMe.taxId = formData.taxId;
					s.agencyMe.timezone = formData.timezone;
					s.agencyMe.established_at = formData.established_at;
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
			console.error('Failed to update business info', error);
		}
		isFormSavingStore.set({ saving: false });
	};

	function onEstablishedDateChange(e: DatePickerEvent) {
		const date = (e.detail as DatePickerDate).selectedDates[0];
		formData.established_at = toIsoString(date);
	}

	function onEstablishedDateBlur(event: FocusEvent) {
		const field = event.target as HTMLInputElement;
		if (!field.value) {
			formData.established_at = '';
		}
	}
</script>

<FormGroup let:isEditing on:submit={onSubmit} on:cancel={reset} data={{...formData}}>
	<FormRow label="Legal Name" {isEditing} hideLabelEditing>
		<div slot="value">{agency.legalName || ''}</div>
		<div slot="fields" class="business-fields">
			<TextInput
				autofocus
				name="legalName"
				labelText="Legal Name"
				placeholder="Enter your legal name"
				bind:value={formData.legalName}
				invalid={!!formErrors?.legalName}
				invalidText={formErrors?.legalName}
			/>
		</div>
	</FormRow>
	<FormRow label="Registration #" {isEditing} hideLabelEditing>
		<div slot="value">{agency.registrationId === null ? '' : agency.registrationId}</div>
		<div slot="fields" class="business-fields">
			<TextInput
				name="registrationId"
				labelText="Registration #"
				placeholder="Enter registration ID"
				bind:value={formData.registrationId}
			/>
		</div>
	</FormRow>
	<FormRow label="Tax ID/VAT#" {isEditing} hideLabelEditing>
		<div slot="value">{agency.taxId === null ? '' : agency.taxId}</div>
		<div slot="fields" class="business-fields">
			<TextInput
				name="taxId"
				labelText="Tax ID/VAT#"
				placeholder="Enter your tax ID"
				bind:value={formData.taxId}
			/>
		</div>
	</FormRow>
	<FormRow label="Business Established" {isEditing} hideLabelEditing>
		<div slot="value">
			{reformatDateToEn(agency.established_at)}
		</div>
		<div slot="fields" class="business-fields">
			<div class="custom-flex-collumn">
				<DatePicker
					on:change={onEstablishedDateChange}
					value={reformatDateToEn(formData.established_at)}
					dateFormat="d/m/Y"
					datePickerType="single"
					maxDate={new Date()}
				>
					<DatePickerInput
						labelText="Business Established"
						placeholder="dd/mm/yyyy"
						invalid={!!formErrors?.established_at}
						invalidText={formErrors?.established_at}
						name="established_at"
					/>
				</DatePicker>
			</div>
		</div>
	</FormRow>
	<FormRow label="Time Zone" {isEditing} hideLabelEditing>
		<div slot="value">
			{#if timezone}
				{timezone.gmt} {timezone.zone}
			{/if}
		</div>
		<div slot="fields" class="business-fields">
			<Select labelText="Time Zone" bind:selected={formData.timezone} name="timezone">
				<SelectItem value="" text="Choose" />
				{#each TIME_ZONES as timeZone}
					<SelectItem value={timeZone.locale} text={`(${timeZone.gmt}) ${timeZone.zone}`} />
				{/each}
			</Select>
		</div>
	</FormRow>
</FormGroup>
