<script lang="ts">
	import type { Destination } from '$lib/store/destination';

	import { TextInput } from 'carbon-components-svelte';
	import { createEventDispatcher } from 'svelte';
	import FormGroup from '../../form/group.svelte';
	import FormRow from '../../form/row.svelte';

	export let index: number;
	export let destinations: Destination[];
	export let activeSection = '';
	const onEdit = (groupName: string) => {
		activeSection = groupName;
	};
	const onCancel = () => {
		activeSection = '';
	};
	const dispatcher = createEventDispatcher();
	const onUpdate = (field: string) => {
		dispatcher('submit', { index, field });
		activeSection = '';
	};
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'destination-location-' + index}
	on:edit={() => onEdit('destination-location-' + index)}
	on:cancel={onCancel}
	on:submit={() => onUpdate('location')}
	groupClass={'group group-destinations'}
>
	<FormRow label="Cities/Regions" {isEditing}>
		<div slot="value">
			{destinations[index].location == null ? '' : destinations[index].location}
		</div>
		<div slot="fields">
			<TextInput
				autofocus
				labelText="Edit Cities/Regions"
				placeholder="Enter Cities/Regions"
				bind:value={destinations[index].location}
			/>
		</div>
	</FormRow>
</FormGroup>
