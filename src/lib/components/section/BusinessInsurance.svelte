<script lang="ts">
	import type { Agency } from '$lib/store/agency';
	import { session } from '$app/stores';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { ppatch } from '$lib/utils/fetch';
	import { TextInput } from 'carbon-components-svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import { notify } from '../Toast.svelte';
	import { clear } from '$lib/store/activeForm';

	export let target: string;
	export let agency: Agency;
	export let activeSection = '';

	type BusinessInsuranceInput = {
		insurance_company: string;
		insurance_policy: string;
	};

	const dispatch = createEventDispatcher();

	let formData: BusinessInsuranceInput;

	const reset = () => {
		formData = {
			insurance_company: agency.insurance_company || '',
			insurance_policy: agency.insurance_policy || ''
		};
	};

	onMount(reset);
	onDestroy(reset);

	const onEdit = (groupName: string = '') => {
		activeSection = groupName;
		formData = {
			insurance_company: agency.insurance_company || '',
			insurance_policy: agency.insurance_policy || ''
		};
	};

	function onCancel() {
		activeSection = '';
	}

	const onSubmit = async () => {
		isFormSavingStore.set({ saving: true });
		try {
			const res = await ppatch(target, formData);
			if (res.ok) {
				dispatch('change', await res.json());
				activeSection = '';
				session.update((s) => {
					s.agencyMe.insurance_company = formData.insurance_company;
					s.agencyMe.insurance_policy = formData.insurance_policy;
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
			console.error('Failed to update business insurance', error);
		}
		isFormSavingStore.set({ saving: false });
	};
	
</script>

<FormGroup
	let:isEditing
	on:edit={() => onEdit('insurance')}
	on:submit={onSubmit}
	on:cancel={reset}
	data={{ ...formData }}
>
<FormRow label="Insurance Company" {isEditing} contentClass="d-mtop-0">
		<div slot="value">
			{agency.insurance_company || ''}
		</div>
		<div slot="fields">
			<TextInput
				autofocus
				labelText={agency.insurance_company || ''}
				hideLabel
				placeholder="Enter your business insurance company"
				bind:value={formData.insurance_company}
				name="insurance_company"
			/>
		</div>
	</FormRow>
	<FormRow label="Insurance Policy" {isEditing}>
		<div slot="value">{agency.insurance_policy || ''}</div>
		<div slot="fields">
			<TextInput
				labelText={agency.insurance_policy || ''}
				hideLabel
				placeholder="Enter your business insurance policy"
				bind:value={formData.insurance_policy}
				name="insurance_policy"
			/>
		</div>
	</FormRow>
</FormGroup>
