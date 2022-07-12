<script lang="ts">
	import CollapsibleSection from '$lib/components/form/CollapsibleSection.svelte';
	import { formatDate } from '$lib/helpers/datetime';
	import { travellersStore, type Traveller } from '$lib/store/traveller';
	import { ENUM_TRIP_STATE_LABEL, type Trip } from '$lib/store/trip';
	import { sortDate } from '$lib/utils/sort';
	import { Button, DataTable, Link, TextInput } from 'carbon-components-svelte';
	import type { DataTableHeader } from 'carbon-components-svelte/types/DataTable/DataTable.svelte';
	import {
		FolderOpen as FolderOpenIcon,
		Forum as ForumIcon,
		Phone as PhoneIcon
	} from 'carbon-icons-svelte';
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
			sort: sortDate
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
			sort: sortDate
		}
	];
	export let trips: Trip[];

	export let noCTA = false;
	let data: TravellerTrips[] = trips.reduce((acc: TravellerTrips[], item: Trip) => {
		if (item.travellers.length > 0 ) {
			const indexExist = acc.findIndex(
				(itemTravellerTrip) => itemTravellerTrip?.traveller?.id === item.travellers[0].id
			);
			if (indexExist >= 0) {
				acc[indexExist].trips.push(item);
			} else {
				acc.push({ id: item.travellers[0].id, traveller: item.travellers[0], trips: [item] });
			}
		} else {
			const indexExist = acc.findIndex(
				(itemTravellerTrip) => !itemTravellerTrip.traveller && !item.travellers[0]
			);
			if (indexExist >= 0) {
				acc[indexExist].trips.push(item);
			} else {
				acc.push({ id: '0', traveller: undefined, trips: [item] });
			}
		}

		return acc;
	}, []);
	let fullname: string;
	let depart_at: string;
	let updated_at: string;
	let href: string;
	export let typeTraveler = false;
	let activeTrip: string | number;
	let lastTrip: string;
	let detailLinkPrefix = '/trips/';

	const getFullNameTraveller = (travellerId) => {
		const traveller = $travellersStore.filter((item) => item.id == travellerId);
		const fullname = `${traveller[0].forename ?? ''} ${traveller[0].surname ?? ''}`;
		return fullname;
	};
</script>

<DataTable expandable sortable bind:headers rows={data} class="table-custom">
	<div slot="cell" let:cell let:row>
		{#if cell.key === 'action'}
			{#if row.trips[0].state === 'enquired'}
				<Button kind="ghost" icon={FolderOpenIcon} size="lg" iconDescription="Download" />
			{/if}
			{#if row.trips[0].state !== 'completed'}
				<Button kind="ghost" icon={PhoneIcon} size="lg" iconDescription="Call" />
				<Button kind="ghost" icon={ForumIcon} size="lg" iconDescription="Chat" />
			{/if}
		{:else if cell.key === 'traveller'}
			{#if row?.traveller}
				<Link href={`/travellers/traveller-${row.traveller.id}`}>
					{row?.traveller?.forename}
					{row?.traveller?.surname}
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
				<Link href={`/trips/trip-detail?id=${row.id}`}>
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
<div class="mobile-table">
	{#each data as row}
		<div class="data-trip">
			{#if !noCTA}
				<div class="custom-button-table mobile-icon">
					{#if row.trips[0].state === 'enquired'}
						<FolderOpenIcon />
					{/if}
					<PhoneIcon />
					<ForumIcon />
				</div>
			{/if}
			<div class="hide">
				{#if row.traveller == null}
					{(fullname = '')}
					{(href = `/account/travelers/traveler-detail?id=${row.id}`)}
				{:else}
					{(fullname = `${row.traveller.forename} ${row.traveller.surname}`)}
					{(href = `/account/travelers/traveler-detail?id=${row.traveller.id}`)}
				{/if}
				{row.trips[0].state !== 'completed' ? (activeTrip = 0) : (activeTrip = '-')}
				{(lastTrip = formatDate(
					row.trips.reduce((acc, item) => {
						if (!acc) {
							acc = item.depart_at;
						} else if (new Date(item.depart_at) > new Date(acc)) {
							acc = item.depart_at;
						}
						return acc;
					}, undefined)
				))}
			</div>
			<Link {href}>
				<TextInput labelText="Client name" bind:value={fullname} />
			</Link>
			<CollapsibleSection headerText={'Show Trip'}>
				<div class="content">
					<div class="mobile-table">
						{#each row.trips as trip}
							<div class="data-trip">
								<div class="hide">
									{#if trip.travellers[0] == null}
										{(fullname = '')}
									{:else}
										{(fullname = `${trip.travellers[0].forename} ${trip.travellers[0].surname}`)}
									{/if}
									{(depart_at = formatDate(trip.depart_at))}
									{(updated_at = formatDate(trip.updated_at))}
								</div>
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
				</div>
			</CollapsibleSection>
			<Link class="half-width" {href}>
				<TextInput labelText="Total Trip" bind:value={row.trips.length} />
				<TextInput labelText="Active Trip" bind:value={activeTrip} />
			</Link>
			<Link {href}>
				<TextInput labelText="Last Trip" bind:value={lastTrip} />
			</Link>
		</div>
	{/each}
</div>
