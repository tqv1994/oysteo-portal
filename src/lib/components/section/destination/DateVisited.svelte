<script lang="ts">
	import { DatePicker, DatePickerInput } from 'carbon-components-svelte';

	import type { Destination } from '$lib/store/destination';

	import { createEventDispatcher } from 'svelte';

	import FormGroup from '../../form/group.svelte';
	import FormRow from '../../form/row.svelte';
	import { formatOutputDatePicker } from '$lib/helpers/datetime';

	export let index: number;
	export let invalidDateVisited: { status: boolean; message: string };
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
	isEditing={activeSection === 'date_visited' + index}
	on:edit={() => onEdit('date_visited' + index)}
	on:cancel={onCancel}
	on:submit={() => onUpdate('date_visited')}
	groupClass={'group group-destinations'}
>
	<FormRow label="Date Visited" {isEditing}>
		<div slot="value">
			{destinations[index]?.date_visited === null
				? ''
				: formatOutputDatePicker(destinations[index]?.date_visited)}
		</div>
		<div slot="fields" style="position:relative"
		>
			<DatePicker
				on:change={(e) => {
					console.log(e.detail);
					destinations[index].date_visited = e.detail?.dateStr || '';
				}}
				value={formatOutputDatePicker(destinations[index].date_visited)}
				datePickerType="single"
			>
				<DatePickerInput
					labelText="date visited"
					placeholder="mm/dd/yyyy"
					invalid={invalidDateVisited.status}
					invalidText={invalidDateVisited.message}
				/>
			</DatePicker>
		</div>
	</FormRow>
</FormGroup>
