<script lang="ts">
	import type { Destination } from '$lib/store/destination';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import {
		Checkbox,
		Select,
		SelectItem,
		TextArea,
		TextInput,
		Toggle
	} from 'carbon-components-svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import { countryStore } from '$lib/store/country';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { sortByName, sortByOrder } from '$lib/utils/sort';

	export let advisorId: string;
	export let destinations: Destination[];
	export let activeSection = '';
	export let userId: string;
	export let type1: string;
	const countries = sortByOrder(sortByName(Object.values($countryStore.items)));

	type CreateDestinationInput = {
		name: string;
		location: string;
		description: string;
		author: string;
		visible: boolean;
		type1: string;
		country: string;
	};

	const onCancel = () => {
		activeSection = '';
	};

	let createDestinationData: CreateDestinationInput;

	const resetCreateDestination = () => {
		createDestinationData = {
			name: '',
			location: '',
			description: '',
			author: userId,
			visible: true,
			type1: type1,
			country: ''
		};
	};

	resetCreateDestination();

	let invalidLocation = {
		status: false,
		message: 'Location is required'
	};

	let invalidCountry = {
		status: false,
		message: 'Country is required'
	};
	const createDestination = async () => {
		if (createDestinationData.country == '') {
			invalidCountry.status = true;
			setTimeout(() => {
				invalidCountry.status = false;
			}, INVALID_DELAY_TIME);
			return;
		}
		isFormSavingStore.set({ saving: true });
		try {
			const res = await fetch('/destination/create.json', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...createDestinationData })
			});

			if (res.ok) {
				const data = await res.json();
				const destinationInserted = data.createDestination.destination;

				const insertedId = destinationInserted.id;
				let destinationIds = [insertedId];
				destinations.forEach((item) => {
					destinationIds = [item.id, ...destinationIds];
				});
				const res_assign = await fetch(`/destination/assign-${advisorId}.json`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ destinationIds })
				});

				if (res_assign.ok) {
					destinations = [...destinations, destinationInserted];
					resetCreateDestination();
					activeSection = '';
				}
			}
		} catch (error) {}
		isFormSavingStore.set({ saving: false });
	};
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'destination-add'}
	on:cancel={onCancel}
	on:submit={createDestination}
	groupClass={'group group-add'}
>
	<FormRow label="Create Destination" {isEditing} class={'create-destination'}>
		<div slot="fields">
			<!-- <TextInput
				labelText="Add name"
				placeholder="Enter destination"
				bind:value={createDestinationData.name}
			/> -->
			<Select
				invalid={invalidCountry.status}
				invalidText={invalidCountry.message}
				labelText="Add Country"
				bind:selected={createDestinationData.country}
				on:change={(e) => {
					createDestinationData.country = e.detail;
				}}
			>
				<SelectItem value="" text="Choose" />
				{#each countries as country}
					<SelectItem value={country.id} text={`${country.name}`} />
				{/each}
			</Select>
			<TextInput
				autofocus
				labelText="Add Cities/Regions"
				placeholder="Enter Cities/Regions"
				bind:value={createDestinationData.location}
				invalid={invalidLocation.status}
				invalidText={invalidLocation.message}
			/>
			<TextArea
				labelText="Add Insight"
				placeholder="Enter insight"
				bind:value={createDestinationData.description}
			/>
			<Checkbox labelText="Visible" bind:checked={createDestinationData.visible} />
		</div>
	</FormRow>
</FormGroup>
