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
		activeSection = '';
	};
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'destination-name-' + index}
	on:edit={() => onEdit('destination-name-' + index)}
	on:cancel={onCancel}
	on:submit={() => onUpdate('name')}
	groupClass={'group group-destinations' + (index != 0 ? '' : ' group-below-add')}
>
	<FormRow label="Destination name" {isEditing}>
		<div slot="value">{destinations[index].name == null ? '' : destinations[index].name}</div>
		<div slot="fields">
			<TextInput
				labelText="Edit Name"
				placeholder="Enter destination name"
				bind:value={destinations[index].name}
			/>
		</div>
	</FormRow>
</FormGroup>
