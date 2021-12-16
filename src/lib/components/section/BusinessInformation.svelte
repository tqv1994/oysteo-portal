<script lang="ts">
	import {
		formatMonthAndYear,
		formatOutputDatePicker,
		handleDisplayTimeZone,
		normalizeInputDatePicker,
		validateMMDDYYYY
	} from '$lib/helpers/datetime';

	import type { Agency } from '$lib/store/agency';
	import { INVALID_DELAY_TIME, TIME_ZONES } from '$lib/utils/constants';
	import {
		DatePicker,
		DatePickerInput,
		Select,
		SelectItem,
		TextInput
	} from 'carbon-components-svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';

	export let type: string;
	export let agency: Agency;
	export let activeSection: string = '';
	export let activeLoading: boolean = false;
	const onEdit = (groupName: string) => {
		activeSection = groupName;
	};
	const onCancel = () => {
		activeSection = '';
	};

	let invalidEstablishedAt = {
		status: false,
		message: 'Invalid date'
	};
	const updateBusinessInformation = async () => {
		try {
			let data = {
				legalName: agency.legalName || '',
				registrationId: agency.registrationId || '',
				taxId: agency.taxId || '',
				timezone: agency.timezone || '',
				established_at: formatOutputDatePicker(agency.established_at)
			};

			if (!validateMMDDYYYY(data.established_at)) {
				invalidEstablishedAt.status = true;
				setTimeout(() => {
					invalidEstablishedAt.status = false;
				}, INVALID_DELAY_TIME);
				return;
			}
			data.established_at = normalizeInputDatePicker(data.established_at);

			activeLoading = true;

			const res = await fetch(`/common/${type}-${agency.id}.json`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...data })
			});
			if (res.ok) {
				alert('Update successfully');
				activeSection = '';
			}
		} catch (error) {}
		activeLoading = false;
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
				labelText="Legal Name"
				placeholder="Enter your legal name..."
				bind:value={agency.legalName}
			/>
		</div>
	</FormRow>
	<FormRow label="Registration #" {isEditing} hideLabelEditing>
		<div slot="value">{agency.registrationId === null ? '' : agency.registrationId}</div>
		<div slot="fields" class="business-fields">
			<TextInput
				labelText="Registration #"
				placeholder="Enter registration ID..."
				bind:value={agency.registrationId}
			/>
		</div>
	</FormRow>
	<FormRow label="Tax ID/VAT#" {isEditing} hideLabelEditing>
		<div slot="value">{agency.taxId === null ? '' : agency.taxId}</div>
		<div slot="fields" class="business-fields">
			<TextInput
				labelText="Tax ID/VAT#"
				placeholder="Enter your tax ID..."
				bind:value={agency.taxId}
			/>
		</div>
	</FormRow>
	<FormRow label="Business Established" {isEditing} hideLabelEditing>
		<div slot="value">
			{agency?.established_at == null ? '' : formatMonthAndYear(agency?.established_at)}
		</div>
		<div slot="fields" class="business-fields">
			<DatePicker
				on:change={(e) => {
					agency.established_at = e.detail.toString();
				}}
				value={formatOutputDatePicker(agency.established_at)}
			>
				<DatePickerInput
					labelText="Business Established"
					placeholder="mm/dd/yyyy"
					invalid={invalidEstablishedAt.status}
					invalidText={invalidEstablishedAt.message}
				/>
			</DatePicker>
		</div>
	</FormRow>
	<FormRow label="Time Zone" {isEditing} hideLabelEditing>
		<div slot="value">{handleDisplayTimeZone(agency.timezone)}</div>
		<div slot="fields" class="business-fields">
			<Select labelText="Time Zone" bind:selected={agency.timezone}>
				<SelectItem value="" text="Choose..." />
				{#each TIME_ZONES as timeZone}
					<SelectItem value={timeZone.locale} text={`(${timeZone.gmt}) ${timeZone.zone}`} />
				{/each}
			</Select>
		</div>
	</FormRow>
</FormGroup>
