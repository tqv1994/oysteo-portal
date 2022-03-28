<script lang="ts">
	import { countryStore } from '$lib/store/country';

	import type { Destination } from '$lib/store/destination';
import { sortByName, sortByOrder } from '$lib/utils/sort';

	import { Checkbox, Select, SelectItem, TextInput, Toggle } from 'carbon-components-svelte';
	import { createEventDispatcher } from 'svelte';
	import { get } from 'svelte/store';

	import FormGroup from '../../form/group.svelte';
	import FormRow from '../../form/row.svelte';

	export let index: number;
	export let destinations: Destination[];
	export let activeSection = '';
	const countries = sortByOrder(sortByName(Object.values($countryStore.items)));

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
	on:submit={() => onUpdate('country')}
	groupClass={'group group-destinations' + (index != 0 ? '' : ' group-below-add')}
>
	<!-- <FormRow label="Destination" {isEditing}>
		<div slot="value">
			{destinations[index].name == null ? '' : destinations[index].name}
		</div>
		<div slot="fields">
			<TextInput
				labelText="Edit Name"
				placeholder="Enter destination"
				bind:value={destinations[index].name}
			/>
		</div>
	</FormRow> -->
	<FormRow label="Destination" {isEditing}>
		<div slot="value">
			{destinations[index].country == null ? '' : destinations[index].country.name}
		</div>
		<div slot="fields">
			<Select
				selected={destinations[index].country.id}
				on:change={(e) => {
					destinations[index].country.id = e.detail;
				}}
			>
				<SelectItem value="" text="Choose" />
				{#each countries as country}
					<SelectItem value={country.id} text={`${country.name}`} />
				{/each}
			</Select>
		</div>
	</FormRow>
</FormGroup>
