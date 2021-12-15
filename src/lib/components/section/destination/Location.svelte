<script lang="ts">
	import type { Destination } from '$lib/store/destination';

	import { TextInput } from 'carbon-components-svelte';
	import { createEventDispatcher } from 'svelte';
	import FormGroup from '../../form/group.svelte';
	import FormRow from '../../form/row.svelte';

	export let index: number;
	export let destinations: Destination[];
	export let activeSection: string = '';
	const onEdit = (groupName: string) => {
		activeSection = groupName;
	};
	const onCancel = () => {
		activeSection = '';
	};
	const dispatcher = createEventDispatcher();
	const onUpdate = (field: string) => {
		dispatcher('submit', { index, field });
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
	<FormRow label="Location" {isEditing}>
		<div slot="value">
			{destinations[index].location == null ? '' : destinations[index].location}
		</div>
		<div slot="fields">
			<TextInput
				labelText={destinations[index].location}
				placeholder="Enter destination location..."
				bind:value={destinations[index].location}
			/>
		</div>
	</FormRow>
</FormGroup>
