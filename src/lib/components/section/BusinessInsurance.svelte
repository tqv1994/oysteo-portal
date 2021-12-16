<script lang="ts">
	import type { Agency } from '$lib/store/agency';

	import { TextInput } from 'carbon-components-svelte';

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

	const updateBusinessInsurance = async () => {
		try {
			let data = {
				insurance_company: agency.insurance_company || '',
				insurance_policy: agency.insurance_policy || ''
			};
			activeLoading = true;

			const res = await fetch(`/common/${type}-${agency.id}.json`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...data })
			});
			if (res.ok) {
				window.openNotification({
					kind: 'success',
					title: 'Success',
					subtitle: 'Update successfully'
				});
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
	<FormRow label="Insurance Company" {isEditing}>
		<div slot="value">
			{agency.insurance_company || ''}
		</div>
		<div slot="fields">
			<TextInput
				labelText={agency.insurance_company || ''}
				placeholder="Enter your business insurance company..."
				bind:value={agency.insurance_company}
			/>
		</div>
	</FormRow>
	<FormRow label="Insurance Policy" {isEditing}>
		<div slot="value">{agency.insurance_policy || ''}</div>
		<div slot="fields">
			<TextInput
				labelText={agency.insurance_policy || ''}
				placeholder="Enter your business insurance policy ..."
				bind:value={agency.insurance_policy}
			/>
		</div>
	</FormRow>
</FormGroup>
