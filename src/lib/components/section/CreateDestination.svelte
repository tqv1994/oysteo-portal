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
	import { session } from '$app/stores';
	import { ppost } from '$lib/utils/fetch';
	import { onMount } from 'svelte';
	import { getCollection } from '$lib/store/collection';

	export let advisorId: string;
	export let destinations: Destination[];
	export let activeSection = '';
	export let userId: string;
	export let type1: string;

	type CreateDestinationInput = {
		location: string;
		description: string;
		visible: boolean;
		country: string;
	};

	let createDestinationData: CreateDestinationInput;

	onMount(async () => {
		let countries = sortByOrder(sortByName(await getCollection(fetch, 'country')));
		countries.map(function (item) {
			item.id = item.id.substring(item.id.lastIndexOf('-') + 1);
		});
		$countryStore = countries;
	});

	function onCancel() {
		activeSection = '';
	}

	const resetCreateDestination = () => {
		createDestinationData = {
			location: '',
			description: '',
			visible: true,
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
			const res = await ppost('destinations', createDestinationData);
			const destination = await res.json();
			session.update((s) => {
				if (s.advisorMe.destinations) {
					s.advisorMe.destinations.push(destination);
				} else {
					s.advisorMe.destinations = [destination];
				}
				return s;
			});
			activeSection = '';
			resetCreateDestination();
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
				{#each $countryStore as country}
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
