<script lang="ts">
	import Edit from '$lib/components/buttons/Edit.svelte';
	import { formatDate } from '$lib/helpers/datetime';
	import {
		TripState,
		ENUM_TRIP_STATE_LABEL,
		type Trip,
		TRipInput,
		tripStore
	} from '$lib/store/trip';
	import { DataTable, Select, SelectItem, TextInput } from 'carbon-components-svelte';
	import type {
		DataTableHeader,
		DataTableRow
	} from 'carbon-components-svelte/types/DataTable/DataTable.svelte';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { notify } from '$lib/components/Toast.svelte';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { ppatch, ppost } from '$lib/utils/fetch';
	import { sortDate } from '$lib/utils/sort';
	import { clear } from '$lib/store/activeForm';

	type FormData = {
		state: TripState;
		reference?: string;
	};

	export let trip: Trip;
	let formGroup: FormGroup;
	let isEditing = false;
	let updated_at: string;
	let formData: FormData = reset();

	function reset(): FormData {
		return {
			state: trip.state,
			reference: trip.reference
		};
	}

	let headers: DataTableHeader[] = [
		{
			key: 'status',
			value: 'Trip Status'
		},
		{
			key: 'lastChange',
			value: 'Last Change',
			sort: sortDate
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

	function onEditClick() {
		formGroup.activate();
	}

	const onSubmit = async () => {
		isFormSavingStore.set({ saving: true });
		try {
			const res = await ppatch(`trips/${trip.id}`, formData);

			if (res.ok) {
				trip = await res.json();
				tripStore.update((s) => {
					const idx = s.findIndex((t) => t.id === trip.id);
					s[idx] = trip;
					return s;
				});
				// goto(trip.id, { replaceState: true });
				clear();
			} else {
				notify({
					title: 'Update failed',
					subtitle: 'Failed to update information, please try again later.'
				});
			}
		} catch (error) {
			notify({
				title: 'Update failed',
				subtitle: 'Failed to update information, please try again later.'
			});
			console.error('Failed to update business insurance', error);
		}

		isFormSavingStore.set({ saving: false });
		status = [
			{
				id: '',
				status: trip?.state || '',
				lastChange: trip?.updated_at || '',
				reference: trip?.reference || ''
			}
		];
	};

	const onCancel = async () => {
		formData = reset();
		isEditing = false;
	};
</script>

{#if !isEditing}
	<DataTable sortable bind:headers bind:rows={status} class="table-custom">
		<div slot="cell" let:cell>
			{#if cell.key === 'action'}
				<div class="text-right">
					<Edit on:click={onEditClick} />
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
			<Edit on:click={onEditClick} />
		</div>
		<div class="half-width">
			<TextInput
				on:click={onEditClick}
				labelText="Trip status"
				bind:value={ENUM_TRIP_STATE_LABEL[trip.state]}
			/>
			<TextInput on:click={onEditClick} labelText="Last change" bind:value={updated_at} />
		</div>
		<TextInput on:click={onEditClick} labelText="Agency Reference" bind:value={trip.reference} />
	</div>
{/if}
<div class={!isEditing ? 'hidden' : ''}>
	<FormGroup
		let:isEditing
		bind:isEditing
		groupClass="group hide-border"
		on:submit={onSubmit}
		on:cancel={onCancel}
		bind:this={formGroup}
		data={{ state: formData.state || '', reference: formData.reference || '' }}
	>
		<FormRow label="Status" {isEditing}>
			<div slot="fields">
				<Select bind:selected={formData.state} name="state">
					{#if !formData.state || formData.state == 'enquired' || formData.state == 'new_enquiry'}
						<SelectItem value={TripState.new_enquiry} text={ENUM_TRIP_STATE_LABEL.new_enquiry} />
						<SelectItem value={TripState.enquired} text={ENUM_TRIP_STATE_LABEL.enquired} />
					{/if}
					<SelectItem value={TripState.planning} text={ENUM_TRIP_STATE_LABEL.planning} />
					<SelectItem value={TripState.confirmed} text={ENUM_TRIP_STATE_LABEL.confirmed} />
					<SelectItem value={TripState.canceled} text={ENUM_TRIP_STATE_LABEL.canceled} />
				</Select>
			</div>
		</FormRow>
		<FormRow label="Agency Reference" {isEditing}>
			<div slot="fields">
				<TextInput autofocus bind:value={formData.reference} name="reference" />
			</div>
		</FormRow>
	</FormGroup>
</div>

<style lang="scss">
	.hidden {
		display: none;
	}
</style>
