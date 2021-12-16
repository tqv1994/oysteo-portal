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

	const updateBusinessAssociation = async () => {
		try {
			let data = {
				iata: agency.iata || '',
				abta: agency.abta || '',
				atol: agency.atol || '',
				arc: agency.arc || '',
				tids: agency.tids || '',
				clia: agency.clia || ''
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
	isEditing={activeSection === 'business-association'}
	on:edit={() => onEdit('business-association')}
	on:cancel={onCancel}
	on:submit={updateBusinessAssociation}
>
	<FormRow label="IATA" {isEditing} contentClass={'mtop-4-5'}>
		<div slot="value">{agency.iata === null ? '' : agency.iata}</div>
		<div slot="fields">
			<TextInput placeholder="Enter IATA" bind:value={agency.iata} />
		</div>
	</FormRow>
	<FormRow label="ABTA" {isEditing} contentClass={'mtop-4-5'} class={'mtop-17-5'}>
		<div slot="value">{agency.abta === null ? '' : agency.abta}</div>
		<div slot="fields">
			<TextInput labelText="" placeholder="Enter ABTA" bind:value={agency.abta} />
		</div>
	</FormRow>
	<FormRow label="ATOL" {isEditing} contentClass={'mtop-4-5'} class={'mtop-17-5'}>
		<div slot="value">{agency.atol === null ? '' : agency.atol}</div>
		<div slot="fields">
			<TextInput placeholder="Enter ATOL" bind:value={agency.atol} />
		</div>
	</FormRow>
	<FormRow label="ARC" {isEditing} contentClass={'mtop-4-5'} class={'mtop-17-5'}>
		<div slot="value">{agency.arc === null ? '' : agency.arc}</div>
		<div slot="fields">
			<TextInput labelText="" placeholder="Enter ARC" bind:value={agency.arc} />
		</div>
	</FormRow>
	<FormRow label="TIDS" {isEditing} contentClass={'mtop-4-5'} class={'mtop-17-5'}>
		<div slot="value">{agency.tids === null ? '' : agency.tids}</div>
		<div slot="fields">
			<TextInput labelText="" placeholder="Enter TIDS" bind:value={agency.tids} />
		</div>
	</FormRow>
	<FormRow label="CLIA" {isEditing} contentClass={'mtop-4-5'} class={'mtop-17-5'}>
		<div slot="value">{agency.clia === null ? '' : agency.clia}</div>
		<div slot="fields">
			<TextInput labelText="" placeholder="Enter CLIA" bind:value={agency.clia} />
		</div>
	</FormRow>
</FormGroup>
