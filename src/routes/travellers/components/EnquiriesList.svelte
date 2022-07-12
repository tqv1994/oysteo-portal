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
			key: 'lead_traveller',
			value: 'Client name'
		},
		{
			key: 'type',
			value: 'Type'
		},
		{
			key: 'budget',
			value: 'Budget'
		},
		{
			key: 'state',
			value: 'Status'
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
	export let trips: Trip[] = [];
	export let typeTraveler = false;
	export let detailLinkPrefix = '/travellers/traveller-';
	let typeTravelerText = 'Member';
	let fullname: string;
	let depart_at: string;
	let updated_at: string;
	let href: string;
	let budget: string;
	export let noCTA = false;

	const getFullNameTraveller = (travellerId) => {
		const traveller = $travellersStore.filter((item) => item.id == travellerId);
		const fullname = `${traveller[0].forename ?? ''} ${traveller[0].surname ?? ''}`;
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
		{:else if cell.key === 'lead_traveller'}
			{#if row?.travellers[0]}
				<Link href={`${detailLinkPrefix}${row.travellers[0].id}`}>
					{row?.travellers[0]?.forename} {row?.travellers[0]?.surname}
				</Link>
			{:else}
				<Link href={`/trips/${row.id}`}>
					{'Add Traveler'}
				</Link>
			{/if}
		{:else if cell.key === 'type'}
			Member
		{:else if cell.key === 'state'}
			{cell.value ? ENUM_TRIP_STATE_LABEL[cell.value] : ''}
		{:else if cell.key === 'updated_at'}
			{cell.value ? formatDate(cell.value) : ''}
		{:else if cell.key === 'budget'}
			{row.currency?.code || ''} {cell.value || ''}
		{:else}{cell.value}{/if}
	</div>
</DataTable>
<div class="mobile-table">
	{#each trips as trip}
		<div class="data-trip">
			<div class="custom-button-table mobile-icon">
				{#if !noCTA}
					<PhoneIcon size={32} />
					<ForumIcon size={32} />
				{/if}
			</div>
			<div class="hide">
				{#if trip.travellers[0] == null}
					{(fullname = 'Add Traveler')}
					{(href = `/account/travelers/traveler-detail?id=${trip.id}`)}
				{:else}
					{(fullname = `${trip.travellers[0].forename} ${trip.travellers[0].surname}`)}
					{(href = `/account/travelers/traveler-detail?id=${trip.travellers[0].id}`)}
				{/if}
				{(depart_at = formatDate(trip.depart_at))}
				{(updated_at = formatDate(trip.updated_at))}
				{#if trip.currency == null}
					{(budget = '')}
				{:else}
					{(budget = `${trip.currency.code} ${trip.budget}`)}
				{/if}
			</div>
			<Link {href}>
				<TextInput labelText="Client name" bind:value={fullname} />
			</Link>
			{#if typeTraveler}
				<Link {href}>
					<TextInput labelText="Type" bind:value={typeTravelerText} />
				</Link>
				<Link class="half-width" {href}>
					<TextInput labelText="Budget" bind:value={budget} />
					<TextInput labelText="Update" bind:value={updated_at} />
				</Link>
			{:else}
				<Link {href}>
					<TextInput labelText="Departure" bind:value={depart_at} />
				</Link>
				<Link {href}>
					<TextInput labelText="Description" bind:value={trip.description} />
				</Link>
				<Link class="half-width" {href}>
					<TextInput labelText="Status" bind:value={ENUM_TRIP_STATE_LABEL[trip.state]} />
					<TextInput labelText="Update" bind:value={updated_at} />
				</Link>
			{/if}
		</div>
	{/each}
</div>
