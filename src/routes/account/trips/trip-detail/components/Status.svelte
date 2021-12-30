<script lang="ts">
	import Edit from '$lib/components/buttons/Edit.svelte';
	import { formatDate } from '$lib/helpers/datetime';

	import { convertTripToInput, ENUM_TRIP_STATE, ENUM_TRIP_STATE_LABEL, Trip, TRipInput } from '$lib/store/trip';
	import { Button, DataTable, Select, SelectItem, TextInput } from 'carbon-components-svelte';
	import type {
		DataTableHeader,
		DataTableRow
	} from 'carbon-components-svelte/types/DataTable/DataTable';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { createTripService, updateTripService } from '$lib/services/trip.services';
import { ENUM_DOCUMENT_TYPE_LABEL } from '$lib/store/document';
	export let trip: Trip | undefined;
	let activeSection: string = "";
	let tripInput: TRipInput;
	let headers: DataTableHeader[] = [
		{
			key: 'status',
			value: 'Trip Status'
		},
		{
			key: 'lastChange',
			value: 'Last Change',
			sort: (a, b) => new Date(a) - new Date(b)
		},
		{
			key: 'reference',
			value: 'Agency Reference'
		},
		{
			key: 'action',
			value: ''
		}
	];

	let status: DataTableRow[] = [
		{
			id: '',
			status: trip?.state || '',
			lastChange: trip?.updated_at || '',
			reference: trip?.reference || ''
		}
	];
	const onEdit = (section: string) => {
		activeSection = section;
		if(trip){
			tripInput = convertTripToInput(trip);
		}else{
			tripInput = new TRipInput();
		}
	};
	const onCancel = () => {
		activeSection = '';
	};

	const onSubmit = async () => {
		window.openLoading(true, 'Saving');
		if (trip) {
			await updateTripService(trip.id, tripInput)
				.then((output) => {
					trip = output;
				})
				.catch((error) => {
					window.openNotification({ kind: 'error', title: 'Error', subtitle: error.message });
				});
		} else {
			await createTripService(tripInput)
				.then((output) => {
					trip = output;
				})
				.catch((error) => {
					window.openNotification({ kind: 'error', title: 'Error', subtitle: error.message });
				});
		}
		window.openLoading(false);
		status = [
			{
				id: '',
				status: trip?.state || '',
				lastChange: trip?.updated_at || '',
				reference: trip?.reference || ''
			}
		];
		activeSection = '';
	};
</script>
{#if activeSection === ""}
<DataTable sortable bind:headers bind:rows={status} class="table-custom">
	<div slot="cell" let:cell>
		{#if cell.key === 'action'}
			<Edit on:click={() => {onEdit('status')}} />
		{:else if cell.key === 'lastChange'}
			{cell.value ? formatDate(cell.value) : ''}
		{:else if cell.key === 'status'}
			{ trip?.state ? ENUM_TRIP_STATE_LABEL[trip?.state] : ''}
		{:else}{cell.value}{/if}
	</div>
</DataTable>
{:else}
<FormGroup
	let:isEditing
	isEditing={activeSection === 'status'}
	on:edit={() => onEdit('status')}
	on:cancel={onCancel}
	on:submit={onSubmit}
>
	<FormRow label="Status" {isEditing}>
		<div slot="fields">
			<Select bind:selected={tripInput.state}>
				<SelectItem value={ENUM_TRIP_STATE.enquired} text={ENUM_TRIP_STATE_LABEL.enquired} />
				<SelectItem value={ENUM_TRIP_STATE.planning} text={ENUM_TRIP_STATE_LABEL.planning} />
				<SelectItem value={ENUM_TRIP_STATE.progressing} text={ENUM_TRIP_STATE_LABEL.progressing} />
				<SelectItem value={ENUM_TRIP_STATE.completed} text={ENUM_TRIP_STATE_LABEL.completed} />
			  </Select>
		</div>
	</FormRow>
	<FormRow label="Agency Reference" {isEditing}>
		<div slot="fields">
			<TextInput bind:value={tripInput.reference} />
		</div>
	</FormRow>
</FormGroup>
{/if}
<style lang="scss">
	@use '../../../../../styles/datatable';
</style>
