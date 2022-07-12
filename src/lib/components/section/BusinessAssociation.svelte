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

	type BusinessAssociationInput = {
		iata: string;
		abta: string;
		atol: string;
		arc: string;
		tids: string;
		clia: string;
	};

	const dispatch = createEventDispatcher();

	let formData: BusinessAssociationInput;

	const reset = () => {
		formData = {
			iata: agency.iata || '',
			abta: agency.abta || '',
			atol: agency.atol || '',
			arc: agency.arc || '',
			tids: agency.tids || '',
			clia: agency.clia || ''
		};
	};
	onMount(reset);
	onDestroy(reset);

	const onSubmit = async () => {
		isFormSavingStore.set({ saving: true });
		try {
			const res = await ppatch(target, formData);
			if (res.ok) {
				dispatch('change', await res.json());
				activeSection = '';
				session.update((s) => {
					s.agencyMe.iata = formData.iata;
					s.agencyMe.abta = formData.abta;
					s.agencyMe.atol = formData.atol;
					s.agencyMe.arc = formData.arc;
					s.agencyMe.tids = formData.tids;
					s.agencyMe.clia = formData.clia;
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
	};
</script>

<FormGroup let:isEditing on:submit={onSubmit} on:cancel={reset} data={{...formData}}>
	<FormRow label="IATA" {isEditing} contentClass={'mtop-4-5'}>
		<div slot="value">{agency.iata || ''}</div>
		<div slot="fields">
			<TextInput autofocus placeholder="Enter IATA" bind:value={formData.iata} name="iata" />
		</div>
	</FormRow>
	<FormRow label="ABTA" {isEditing} contentClass={'mtop-4-5'} class={'mtop-17-5'}>
		<div slot="value">{agency.abta || ''}</div>
		<div slot="fields">
			<TextInput labelText="" placeholder="Enter ABTA" bind:value={formData.abta} name="abta" />
		</div>
	</FormRow>
	<FormRow label="ATOL" {isEditing} contentClass={'mtop-4-5'} class={'mtop-17-5'}>
		<div slot="value">{agency.atol || ''}</div>
		<div slot="fields">
			<TextInput placeholder="Enter ATOL" bind:value={formData.atol} name="atol" />
		</div>
	</FormRow>
	<FormRow label="ARC" {isEditing} contentClass={'mtop-4-5'} class={'mtop-17-5'}>
		<div slot="value">{agency.arc || ''}</div>
		<div slot="fields">
			<TextInput labelText="" placeholder="Enter ARC" bind:value={formData.arc} name="arc"/>
		</div>
	</FormRow>
	<FormRow label="TIDS" {isEditing} contentClass={'mtop-4-5'} class={'mtop-17-5'}>
		<div slot="value">{agency.tids || ''}</div>
		<div slot="fields">
			<TextInput labelText="" placeholder="Enter TIDS" bind:value={formData.tids} name="tids" />
		</div>
	</FormRow>
	<FormRow label="CLIA" {isEditing} contentClass={'mtop-4-5'} class={'mtop-17-5'}>
		<div slot="value">{agency.clia || ''}</div>
		<div slot="fields">
			<TextInput labelText="" placeholder="Enter CLIA" bind:value={formData.clia} name="clia" />
		</div>
	</FormRow>
</FormGroup>
