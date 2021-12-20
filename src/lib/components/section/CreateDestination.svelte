<script lang="ts">
	import type { Destination } from '$lib/store/destination';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { TextArea, TextInput } from 'carbon-components-svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';

	export let advisorId: string;
	export let destinations: Destination[];
	export let activeSection: string = '';
	export let activeLoading: boolean = false;
	export let loadingLabel: string;
	const onEdit = (groupName: string) => {
		activeSection = groupName;
	};
	const onCancel = () => {
		activeSection = '';
	};

	let createDestinationData = {
		name: '',
		location: '',
		description: ''
	};
	let invalidLocation = {
		status: false,
		message: 'Location is required'
	};
	const createDestination = async () => {
		if (createDestinationData.location == '') {
			invalidLocation.status = true;
			setTimeout(() => {
				invalidLocation.status = false;
			}, INVALID_DELAY_TIME);
			return;
		}
		activeLoading = true;
		loadingLabel = 'Creating ...';
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
					activeSection = '';
				}
			}
		} catch (error) {}
		activeLoading = false;
		loadingLabel = 'Saving ...';
	};
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'destination-add'}
	on:edit={() => onEdit('destination-add')}
	on:cancel={onCancel}
	on:submit={createDestination}
	groupClass={'group group-add'}
>
	<FormRow label="Create Destination" {isEditing} class={'create-destination'}>
		<div slot="fields">
			<TextInput
				labelText="Tuscany"
				placeholder="Enter destination name..."
				bind:value={createDestinationData.name}
			/>
			<TextInput
				labelText="Add location"
				placeholder="Enter destination location..."
				bind:value={createDestinationData.location}
				invalid={invalidLocation.status}
				invalidText={invalidLocation.message}
			/>
			<TextArea
				labelText="Add Insight"
				placeholder="Enter insight..."
				bind:value={createDestinationData.description}
			/>
		</div>
	</FormRow>
</FormGroup>
