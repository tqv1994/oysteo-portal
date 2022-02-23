<script lang="ts">
	import { DatePicker, DatePickerInput } from 'carbon-components-svelte';

	import type { Destination } from '$lib/store/destination';

	import { createEventDispatcher } from 'svelte';

	import FormGroup from '../../form/group.svelte';
	import FormRow from '../../form/row.svelte';
	import { formatMonthAndYear, formatOutputDatePicker } from '$lib/helpers/datetime';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';

	export let index: number;
	let invalidDateVisited =  { 
		status: false,
		message: 'please enter date visited' 
	};
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
		const date_visited = document.getElementById('date_visited');

		if(date_visited.value == ''){
			invalidDateVisited.status = true;
			setTimeout(() => {
				invalidDateVisited.status = false;
			}, INVALID_DELAY_TIME);
			return;
		}else{
			destinations[index].date_visited = date_visited.value;
			invalidDateVisited.status = false;
			dispatcher('submit', { index, field });
			activeSection = '';
		}
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
				: formatMonthAndYear(destinations[index]?.date_visited)}
		</div>
		<div slot="fields" style="position:relative"
		>
			<DatePicker
				on:change={(e) => {
					invalidDateVisited.status = false;
					// destinations[index].date_visited = e.detail?.dateStr || '';
				}}
				value={formatOutputDatePicker(destinations[index].date_visited)}
				datePickerType="single"
			>
				<DatePickerInput
					id="date_visited"
					labelText="date visited"
					placeholder="mm/dd/yyyy"
					invalid={invalidDateVisited.status}
					invalidText={invalidDateVisited.message}
				/>
			</DatePicker>
		</div>
	</FormRow>
</FormGroup>
