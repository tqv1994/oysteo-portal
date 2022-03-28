<script lang="ts">
	import Edit from '$lib/components/buttons/Edit.svelte';
	import { formatDate } from '$lib/helpers/datetime';

	import {
		convertTripToInput,
		ENUM_TRIP_STATE,
		ENUM_TRIP_STATE_LABEL,
		Trip,
		TRipInput
	} from '$lib/store/trip';
	import { Button, DataTable, Select, SelectItem, TextInput } from 'carbon-components-svelte';
	import type {
		DataTableHeader,
		DataTableRow
	} from 'carbon-components-svelte/types/DataTable/DataTable';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { createTripService, updateTripService } from '$lib/services/trip.services';
	import { ENUM_DOCUMENT_TYPE_LABEL } from '$lib/store/document';
	import { goto } from '$app/navigation';
	import { notify } from '$lib/components/Toast.svelte';
import { isFormSavingStore } from '$lib/store/isFormSaving';
	export let trip: Trip | undefined;
	let activeSection = '';
	let tripInput: TRipInput;
	let updated_at: string;
	let state: string;
	let reference: string;

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
		if (trip) {
			tripInput = convertTripToInput(trip);
		} else {
			tripInput = new TRipInput();
		}
	};
	const onCancel = () => {
		activeSection = '';
	};

	const onSubmit = async () => {
		isFormSavingStore.set({saving: true});
		if (trip) {
			await updateTripService(trip.id, tripInput)
				.then((output) => {
					trip = output;
				})
				.catch((error) => {
					notify({ kind: 'error', title: 'Error', subtitle: error.message });
				});
		} else {
			!tripInput.state ? (tripInput.state = 'new_enquiry') : tripInput.state;

			await createTripService(tripInput)
				.then((output) => {
					trip = output;
				})
				.catch((error) => {
					notify({ kind: 'error', title: 'Error', subtitle: error.message });
				});
			!trip.updated_at ? (updated_at = '') : (updated_at = formatDate(trip.updated_at));
			!trip.state ? (state = '') : (state = trip.state);
			!trip.reference ? (reference = '') : (reference = trip.reference);
		}

		isFormSavingStore.set({saving: false});
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

	if (!trip) {
		activeSection = 'status';
		tripInput = new TRipInput();
	} else {
		tripInput = convertTripToInput(trip);
		!trip.updated_at ? (updated_at = '') : (updated_at = formatDate(trip.updated_at));
		!trip.state ? (state = '') : (state = trip.state);
		!trip.reference ? (reference = '') : (reference = trip.reference);
	}
</script>

{#if activeSection === ''}
	<DataTable sortable bind:headers bind:rows={status} class="table-custom">
		<div slot="cell" let:cell>
			{#if cell.key === 'action'}
				<div class="text-right">
					<Edit
						on:click={() => {
							onEdit('status');
						}}
					/>
				</div>
			{:else if cell.key === 'lastChange'}
				{cell.value ? formatDate(cell.value) : ''}
			{:else if cell.key === 'status'}
				{trip?.state ? ENUM_TRIP_STATE_LABEL[trip?.state] : ''}
			{:else}{cell.value}{/if}
		</div>
	</DataTable>
	<div class="mobile-table custom-status">
		<div class="hide" />
		<div class="custom-button-edit">
			<Edit
				on:click={() => {
					onEdit('status');
				}}
			/>
		</div>
		<div class="half-width">
			<TextInput
				on:click={() => {
					onEdit('status');
				}}
				labelText="Trip status"
				bind:value={ENUM_TRIP_STATE_LABEL[state]}
			/>
			<TextInput
				on:click={() => {
					onEdit('status');
				}}
				labelText="Last change"
				bind:value={updated_at}
			/>
		</div>
		<TextInput
			on:click={() => {
				onEdit('status');
			}}
			labelText="Agency Reference"
			bind:value={reference}
		/>
	</div>
{:else}
	<FormGroup
		groupClass="group hide-border"
		let:isEditing
		isEditing={activeSection === 'status'}
		on:edit={() => onEdit('status')}
		on:cancel={onCancel}
		on:submit={onSubmit}
	>
		<FormRow label="Status" {isEditing}>
			<div slot="fields">
				<Select bind:selected={tripInput.state}>
					{#if !trip || trip.state == 'enquired' || trip.state == 'new_enquiry'}
						<SelectItem
							value={ENUM_TRIP_STATE.new_enquiry}
							text={ENUM_TRIP_STATE_LABEL.new_enquiry}
						/>
						<SelectItem value={ENUM_TRIP_STATE.enquired} text={ENUM_TRIP_STATE_LABEL.enquired} />
					{/if}
					<SelectItem value={ENUM_TRIP_STATE.planning} text={ENUM_TRIP_STATE_LABEL.planning} />
					<SelectItem value={ENUM_TRIP_STATE.confirmed} text={ENUM_TRIP_STATE_LABEL.confirmed} />
					<SelectItem value={ENUM_TRIP_STATE.canceled} text={ENUM_TRIP_STATE_LABEL.canceled} />
				</Select>
			</div>
		</FormRow>
		<FormRow label="Agency Reference" {isEditing}>
			<div slot="fields">
				<TextInput autofocus bind:value={tripInput.reference} />
			</div>
		</FormRow>
	</FormGroup>
{/if}

<style lang="scss">
	@use '../../../../../styles/datatable';
</style>
