<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';

	import type { Trip } from '$lib/store/trip';
	import { ENUM_TRIP_STATE_LABEL } from '$lib/store/trip';
	import {
		Button,
		DataTable,
		Link,
		OverflowMenu,
		OverflowMenuItem,
		TextInput
	} from 'carbon-components-svelte';
	import type { DataTableHeader } from 'carbon-components-svelte/types/DataTable/DataTable';
	import { Forum32, Phone32 } from 'carbon-icons-svelte';
	let headers: DataTableHeader[] = [
		{
			key: 'lead_traveller.forename',
			value: 'Client name'
		},
		{
			key: 'depart_at',
			value: 'Departure',
			display: (date) => formatDate(date),
			sort: (a, b) => new Date(a) - new Date(b)
		},
		{
			key: 'description',
			value: 'Description'
		},
		{
			key: 'state',
			value: 'Status'
		},
		{
			key: 'updated_at',
			value: 'Updated',
			display: (date) => (date ? formatDate(date) : ''),
			sort: (a, b) => new Date(a) - new Date(b)
		},
		{
			key: 'action',
			value: ''
		}
	];
	export let trips: Trip[];
	export let detailLinkPrefix = '/account/trips/trip-detail?id=';
	export let noCTA = false;
	let fullname: string;
	let depart_at: string;
	let updated_at: string;
</script>

<DataTable sortable bind:headers rows={trips} class="table-custom">
	<div slot="cell" let:cell let:row>
		{#if cell.key === 'action'}
			{#if !noCTA}
				<Button kind="ghost" icon={Phone32} iconDescription="Call" />
				<Button kind="ghost" icon={Forum32} iconDescription="Chat" />
			{/if}
		{:else if cell.key === 'lead_traveller.forename'}
			{#if row.lead_traveller}
				<Link href={`${detailLinkPrefix}${row.id}`}>
					{`${row.lead_traveller.forename || ''} ${row.lead_traveller.surname || ''}`}
				</Link>
			{/if}
		{:else if cell.key === 'state'}
			<Link href={`${detailLinkPrefix}${row.id}`}>
				{cell.value ? ENUM_TRIP_STATE_LABEL[cell.value] : ''}
			</Link>
		{:else if cell.key === 'depart_at'}
			<Link href={`${detailLinkPrefix}${row.id}`}>
				{cell.value ? formatDate(cell.value) : ''}
			</Link>
		{:else if cell.key === 'updated_at'}
			<Link href={`${detailLinkPrefix}${row.id}`}>
				{cell.value ? formatDate(cell.value) : ''}
			</Link>
		{:else if cell.key === 'description'}
			<Link href={`${detailLinkPrefix}${row.id}`}>
				{cell.value || ''}
			</Link>
		{:else}{cell.value}{/if}
	</div>
</DataTable>
<div class="mobile-table">
	{#each trips as trip}
		<div class="data-trip">
			{#if !noCTA}
				<div class="custom-button-table mobile-icon">
					<Phone32 />
					<Forum32 />
				</div>
			{/if}
			<div class="hide">
				{#if trip.lead_traveller == null}
					{(fullname = '')}
				{:else}
					{(fullname = `${trip.lead_traveller.forename} ${trip.lead_traveller.surname}`)}
				{/if}
				{(depart_at = formatDate(trip.depart_at))}
				{(updated_at = formatDate(trip.updated_at))}
			</div>
			<Link href={`${detailLinkPrefix}${trip.id}`}>
				<TextInput labelText="Client name" bind:value={fullname} />
			</Link>
			<Link href={`${detailLinkPrefix}${trip.id}`}>
				<TextInput labelText="Departure" bind:value={depart_at} />
			</Link>
			<Link href={`${detailLinkPrefix}${trip.id}`}>
				<TextInput labelText="Description" bind:value={trip.description} />
			</Link>
			<Link class="half-width" href={`${detailLinkPrefix}${trip.id}`}>
				<TextInput labelText="Status" bind:value={ENUM_TRIP_STATE_LABEL[trip.state]} />
				<TextInput labelText="Update" bind:value={updated_at} />
			</Link>
		</div>
	{/each}
</div>

<style lang="scss">
	@use '../../../../styles/datatable';
</style>
