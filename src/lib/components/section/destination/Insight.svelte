<script lang="ts">
	import type { Destination } from '$lib/store/destination';

	import { TextArea, TextInput } from 'carbon-components-svelte';
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
	isEditing={activeSection === 'insignt-' + index}
	on:edit={() => onEdit('insignt-' + index)}
	on:cancel={onCancel}
	on:submit={() => onUpdate('description')}
	groupClass={'group group-destinations'}
>
	<FormRow label="Insight" {isEditing} contentClass={'mtop-7'}>
		<div slot="value">
			<p class="destination-insight">
				{destinations[index].description == null ? '' : destinations[index].description}
			</p>
		</div>
		<div slot="fields">
			<TextArea
				labelText="Add Insight"
				placeholder="Enter insight..."
				bind:value={destinations[index].description}
			/>
		</div>
	</FormRow>
</FormGroup>
