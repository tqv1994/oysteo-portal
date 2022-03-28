<script lang="ts">
	import {
		formatMonthAndYear,
		formatOutputDatePicker,
		handleDisplayTimeZone,
		normalizeInputDatePicker,
		validateMMDDYYYY
	} from '$lib/helpers/datetime';

	import type { Agency } from '$lib/store/agency';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { INVALID_DELAY_TIME, TIME_ZONES } from '$lib/utils/constants';
	import {
		DatePicker,
		DatePickerInput,
		Select,
		SelectItem,
		TextInput
	} from 'carbon-components-svelte';
	import { onDestroy } from 'svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';

	export let type: string;
	export let agency: Agency;
	export let activeSection = '';

	type BusinessInfoInput = {
		legalName: string;
		registrationId: string;
		taxId: string;
		timezone: string;
		established_at: string | null;
	};

	let businessInfo: BusinessInfoInput;

	const resetBusinessInfoInput = () => {
		businessInfo = {
			legalName: '',
			registrationId: '',
			taxId: '',
			timezone: '',
			established_at: null
		};
	};

	resetBusinessInfoInput();
	onDestroy(() => {
		resetBusinessInfoInput();
	});

	const onEdit = (groupName: string) => {
		activeSection = groupName;
		businessInfo = {
			legalName: agency.legalName || '',
			registrationId: agency.registrationId || '',
			taxId: agency.taxId || '',
			timezone: agency.timezone || '',
			established_at: formatOutputDatePicker(agency.established_at)
		};
	};
	const onCancel = () => {
		activeSection = '';
	};

	type FormError = {
		established_at?: string;
	};

	let formErrors: FormError;

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	const updateBusinessInformation = async () => {
		const errors: FormError = {};
		try {
			if (!validateMMDDYYYY(businessInfo.established_at)) {
				errors.established_at = 'Email address is invalid';
			}
			businessInfo.established_at = normalizeInputDatePicker(businessInfo.established_at);
			if (Object.keys(errors).length) {
				showErrors(errors);
				return;
			}

			isFormSavingStore.set({ saving: true });

			const res = await fetch(`/common/${type}-${agency.id}.json`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...businessInfo })
			});
			if (res.ok) {
				for (const key in businessInfo) {
					agency[key] = businessInfo[key];
				}
				resetBusinessInfoInput();
				onCancel();
			}
		} catch (error) {}
		isFormSavingStore.set({ saving: false });
	};
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'business-information'}
	on:edit={() => onEdit('business-information')}
	on:cancel={onCancel}
	on:submit={updateBusinessInformation}
>
	<FormRow label="Legal Name" {isEditing} hideLabelEditing>
		<div slot="value">{agency.legalName === null ? '' : agency.legalName}</div>
		<div slot="fields" class="business-fields">
			<TextInput
				autofocus
				labelText="Legal Name"
				placeholder="Enter your legal name"
				bind:value={businessInfo.legalName}
			/>
		</div>
	</FormRow>
	<FormRow label="Registration #" {isEditing} hideLabelEditing>
		<div slot="value">{agency.registrationId === null ? '' : agency.registrationId}</div>
		<div slot="fields" class="business-fields">
			<TextInput
				labelText="Registration #"
				placeholder="Enter registration ID"
				bind:value={businessInfo.registrationId}
			/>
		</div>
	</FormRow>
	<FormRow label="Tax ID/VAT#" {isEditing} hideLabelEditing>
		<div slot="value">{agency.taxId === null ? '' : agency.taxId}</div>
		<div slot="fields" class="business-fields">
			<TextInput
				labelText="Tax ID/VAT#"
				placeholder="Enter your tax ID"
				bind:value={businessInfo.taxId}
			/>
		</div>
	</FormRow>
	<FormRow label="Business Established" {isEditing} hideLabelEditing>
		<div slot="value">
			{agency?.established_at == null ? '' : formatMonthAndYear(agency?.established_at)}
		</div>
		<div slot="fields" class="business-fields" style="position: relative;">
			<DatePicker
				on:change={(e) => {
					businessInfo.established_at = e.detail.dateStr;
				}}
				value={formatOutputDatePicker(agency.established_at)}
				datePickerType="single"
				maxDate={new Date()}
			>
				<DatePickerInput
					labelText="Business Established"
					placeholder="mm/dd/yyyy"
					invalid={!!formErrors?.established_at}
					invalidText={formErrors?.established_at}
				/>
			</DatePicker>
		</div>
	</FormRow>
	<FormRow label="Time Zone" {isEditing} hideLabelEditing>
		<div slot="value">{handleDisplayTimeZone(agency.timezone)}</div>
		<div slot="fields" class="business-fields">
			<Select labelText="Time Zone" bind:selected={businessInfo.timezone}>
				<SelectItem value="" text="Choose" />
				{#each TIME_ZONES as timeZone}
					<SelectItem value={timeZone.locale} text={`(${timeZone.gmt}) ${timeZone.zone}`} />
				{/each}
			</Select>
		</div>
	</FormRow>
</FormGroup>
