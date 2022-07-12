<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';
	import { travellersStore } from '$lib/store/traveller';
	import type { Trip } from '$lib/store/trip';
	import { ENUM_TRIP_STATE_LABEL } from '$lib/store/trip';
	import { sortDate } from '$lib/utils/sort';
	import { Button, DataTable, Link, TextInput } from 'carbon-components-svelte';
	import type { DataTableHeader } from 'carbon-components-svelte/types/DataTable/DataTable.svelte';
	import { Forum as ForumIcon, Phone as PhoneIcon } from 'carbon-icons-svelte';
	let headers: DataTableHeader[] = [
		{
			key: 'trip_id',
			value: 'Client name'
		},
		{
			key: 'depart_at',
			value: 'Departure',
			display: (date) => formatDate(date),
			sort: sortDate
		},
		{
			key: 'description',
			value: 'Description'
		},
		{
			key: 'updated_at',
			value: 'Updated',
			display: (date) => (date ? formatDate(date) : ''),
			sort: sortDate
		},
		{
			key: 'action',
			value: ''
		}
	];
	export let trips: Trip[];
	export let detailLinkPrefix = '/trips/';
	export let noCTA = false;
	export let leads = false;
	let fullname: string;
	let depart_at: string;
	let updated_at: string;

	const getFullNameTraveller = (travellerId) => {
		if (typeof travellerId == 'object') {
			return `${travellerId?.forename ?? ''} ${travellerId?.surname ?? ''}`;
		}
		const traveller = $travellersStore.filter((item) => item.id == travellerId);
		const fullname = `${traveller[0]?.forename ?? ''} ${traveller[0]?.surname ?? ''}`;
		return fullname;
	};
</script>

<DataTable sortable bind:headers rows={trips} class="table-custom">
	<div slot="cell" let:cell let:row>
		{#if cell.key === 'action'}
			{#if !noCTA}
				<Button kind="ghost" icon={PhoneIcon} size="lg" iconDescription="Call" />
				<Button kind="ghost" icon={ForumIcon} size="lg" iconDescription="Chat" />
			{/if}
		{:else if cell.key === 'trip_id'}
			{#if row?.travellers[0]}
				<Link href={`${detailLinkPrefix}${row.id}`}>
					{row?.travellers[0]?.forename ?? ''}
					{row?.travellers[0]?.surname ?? ''}
				</Link>
			{/if}
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
					<PhoneIcon size={32} />
					<ForumIcon size={32} />
				</div>
			{/if}
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
