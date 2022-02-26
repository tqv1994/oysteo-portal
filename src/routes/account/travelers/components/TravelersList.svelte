<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';
	import type { Traveller } from '$lib/store/traveller';

	import { ENUM_TRIP_STATE_LABEL, Trip } from '$lib/store/trip';
	import { Button, DataTable, Link } from 'carbon-components-svelte';
	import type { DataTableHeader } from 'carbon-components-svelte/types/DataTable/DataTable';
	import { FolderOpen32, Forum32, Phone32 } from 'carbon-icons-svelte';
	type TravellerTrips = {
		id: string | number;
		traveller: Traveller;
		trips: Trip[];
	};
	let headers: DataTableHeader[] = [
		{
			key: 'traveller',
			value: 'Client name'
		},
		{
			key: 'total_trips',
			value: 'Total Trips'
		},
		{
			key: 'active_trips',
			value: 'Active Trips'
		},
		{
			key: 'last_trip',
			value: 'Last Trip'
		},
		{
			key: 'action',
			value: ''
		}
	];
	let subTableHeaders: DataTableHeader[] = [
		{
			key: 'depart_at',
			value: 'Departure',
			display: (date) => (date ? formatDate(date) : '-'),
			sort: (a, b) => new Date(a) - new Date(b)
		},
		{
			key: 'description',
			value: 'Description',
			display: (value) => value || ''
		},
		{
			key: 'state',
			value: 'Status',
			display: (value) => (value ? ENUM_TRIP_STATE_LABEL[value] : '')
		},
		{
			key: 'updated_at',
			value: 'Updated',
			display: (date) => (date ? formatDate(date) : ''),
			sort: (a, b) => new Date(a) - new Date(b)
		}
	];
	export let trips: Trip[];
	console.log(trips);
	
	let data: TravellerTrips[] = trips.reduce((acc: TravellerTrips[], item: Trip) => {
		if (item.lead_traveller) {
			const indexExist = acc.findIndex(
				(itemTravellerTrip) => itemTravellerTrip?.traveller?.id === item.lead_traveller.id
			);
			if (indexExist >= 0) {
				acc[indexExist].trips.push(item);
			} else {
				acc.push({ id: item.lead_traveller.id, traveller: item.lead_traveller, trips: [item] });
			}
		} else {
			const indexExist = acc.findIndex(
				(itemTravellerTrip) => !itemTravellerTrip.traveller && !item.lead_traveller
			);
			if (indexExist >= 0) {
				acc[indexExist].trips.push(item);
			} else {
				acc.push({ id: '0', traveller: undefined, trips: [item] });
			}
		}
		return acc;
	}, []);
	
</script>

<DataTable expandable sortable bind:headers rows={data} class="table-custom">
	<div slot="cell" let:cell let:row>
		{#if cell.key === 'action'}
			{#if row.trips[0].state === 'enquired'}
				<Button kind="ghost" icon={FolderOpen32} iconDescription="Download" />
			{/if}
			{#if row.trips[0].state !== 'completed'}
				<Button kind="ghost" icon={Phone32} iconDescription="Call" />
				<Button kind="ghost" icon={Forum32} iconDescription="Chat" />
			{/if}
		{:else if cell.key === 'traveller'}
			{#if row.traveller}
				<Link href={`/account/travelers/traveler-detail?id=${row.id}`}>
					{`${row.traveller?.forename || ''} ${row.traveller?.surname || ''}`}
				</Link>
			{/if}
		{:else if cell.key === 'total_trips'}
			{row.trips?.length || 0}
		{:else if cell.key === 'active_trips'}
			{row.trips[0].state !== 'completed' ? 0 : '-'}
		{:else if cell.key === 'last_trip'}
			{formatDate(
				row.trips.reduce((acc, item) => {
					if (!acc) {
						acc = item.depart_at;
					} else if (new Date(item.depart_at) > new Date(acc)) {
						acc = item.depart_at;
					}
					return acc;
				}, undefined)
			)}
		{:else if cell.key === 'description'}
			<p style="width: 150px">{cell.value || ''}</p>
		{:else}{cell.value}{/if}
	</div>
	<div slot="expanded-row" let:row>
		<DataTable
			sortable
			bind:headers={subTableHeaders}
			rows={row.trips}
			class="table-custom sub-table"
		>
			<div slot="cell" let:cell let:row>
				<Link href={`/account/trips/trip-detail?id=${row.id}`}>
					{#if cell.key === 'depart_at'}
						{cell.value ? formatDate(cell.value) : '-'}
					{:else if cell.key === 'state'}
						{cell.value ? ENUM_TRIP_STATE_LABEL[cell.value] : ''}
					{:else if cell.key === 'updated_at'}
						{cell.value ? formatDate(cell.value) : '-'}
					{:else}
						{cell.value || ''}
					{/if}
				</Link>
			</div>
		</DataTable>
	</div>
</DataTable>

<style lang="scss">
	@use '../../../../styles/datatable';
</style>
