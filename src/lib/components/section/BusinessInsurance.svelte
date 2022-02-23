<script lang="ts">
	import type { Agency } from '$lib/store/agency';

	import { TextInput } from 'carbon-components-svelte';
	import { onDestroy } from 'svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';

	export let type: string;
	export let agency: Agency;
	export let activeSection: string = '';
	export let activeLoading: boolean = false;

	type BusinessInsuranceInput = {
		insurance_company: string;
		insurance_policy: string;
	};

	let businessInsuranceInput: BusinessInsuranceInput;

	const resetBusinessInsuranceInput = () => {
		businessInsuranceInput = {
			insurance_company: '',
			insurance_policy: ''
		};
	};

	resetBusinessInsuranceInput();
	onDestroy(() => {
		resetBusinessInsuranceInput();
	});
	const onEdit = (groupName: string) => {
		activeSection = groupName;
		businessInsuranceInput = {
			insurance_company: agency.insurance_company || '',
			insurance_policy: agency.insurance_policy || ''
		};
	};
	const onCancel = () => {
		activeSection = '';
	};

	const updateBusinessInsurance = async () => {
		try {
			activeLoading = true;

			const res = await fetch(`/common/${type}-${agency.id}.json`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...businessInsuranceInput })
			});
			if (res.ok) {
				for (const key in businessInsuranceInput) {
					agency[key] = businessInsuranceInput[key];
				}
				resetBusinessInsuranceInput();
				onCancel();
			}
		} catch (error) {}
		activeLoading = false;
	};
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'business-insurance'}
	on:edit={() => onEdit('business-insurance')}
	on:cancel={onCancel}
	on:submit={updateBusinessInsurance}
>
	<FormRow label="Insurance Company" {isEditing} contentClass="d-mtop-0">
		<div slot="value">
			{agency.insurance_company || ''}
		</div>
		<div slot="fields">
			<TextInput
				labelText={agency.insurance_company || ''}
				hideLabel
				placeholder="Enter your business insurance company..."
				bind:value={businessInsuranceInput.insurance_company}
			/>
		</div>
	</FormRow>
	<FormRow label="Insurance Policy" {isEditing}>
		<div slot="value">{agency.insurance_policy || ''}</div>
		<div slot="fields">
			<TextInput
				labelText={agency.insurance_policy || ''}
				hideLabel
				placeholder="Enter your business insurance policy..."
				bind:value={businessInsuranceInput.insurance_policy}
			/>
		</div>
	</FormRow>
</FormGroup>
