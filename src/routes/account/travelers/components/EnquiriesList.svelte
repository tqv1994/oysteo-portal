<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';

	import type { Trip } from '$lib/store/trip';
	import {ENUM_TRIP_STATE_LABEL} from '$lib/store/trip';
	import { Button, DataTable, Link, OverflowMenu, OverflowMenuItem, TextInput } from 'carbon-components-svelte';
	import type { DataTableHeader } from 'carbon-components-svelte/types/DataTable/DataTable';
	import { Forum32, Phone32 } from 'carbon-icons-svelte';
	let headers: DataTableHeader[] = [
		{
			key: 'lead_traveller',
			value: 'Client name'
		},
		{
			key: 'type',
			value: 'Type',
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
			sort: (a, b) => new Date(a) - new Date(b)
		},
		{
			key: 'action',
			value: ''
		}
	];
	export let trips: Trip[] = [];
	export let typeTraveler: boolean = false;
	let typeTravelerText:string = 'Member';
	let fullname: string;
	let depart_at: string;
	let updated_at: string;
	let href: string;
	let budget: string;
	export let noCTA: boolean = false;
</script>

<DataTable sortable bind:headers rows={trips} class="table-custom">
	<div slot="cell" let:cell let:row>
		{#if cell.key === 'action'}
			{#if noCTA}
				<Button kind="ghost" icon={Phone32} disabled/>
				<Button kind="ghost" icon={Forum32} disabled/>
			{:else}
				<Button kind="ghost" icon={Phone32} iconDescription="Call" />
				<Button kind="ghost" icon={Forum32} iconDescription="Chat" />
			{/if}
        {:else if cell.key === 'lead_traveller'}
			{#if row.lead_traveller}
                <Link href={`/account/travelers/traveler-detail?id=${row.lead_traveller.id}`}>
                    {`${row.lead_traveller.forename || ''} ${row.lead_traveller.surname || ''}`}
                </Link>
            {:else}
                <Link href={`/account/trips/trip-detail?id=${row.id}`}>
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
				<Phone32 />
				<Forum32 />
			{/if}
		</div>
		<div class="hide">
			{#if trip.lead_traveller == null}
				{fullname = 'Add Traveler'}
				{href = `/account/travelers/traveler-detail?id=${trip.id}`}
			{:else}
				{fullname = `${trip.lead_traveller.forename} ${trip.lead_traveller.surname}`}
				{href = `/account/travelers/traveler-detail?id=${trip.lead_traveller.id}`}
			{/if}
			{depart_at = formatDate(trip.depart_at)}
			{updated_at = formatDate(trip.updated_at)}
			{#if trip.currency == null}
				{budget = ''}
			{:else}
				{budget = `${trip.currency.code} ${trip.budget}`}
			{/if}
		</div>
		<Link href={href}>
			<TextInput
				labelText='Client name'
				bind:value={fullname}
			/>
		</Link>
		{#if typeTraveler}
		<Link href={href}>
			<TextInput
				labelText='Type'
				bind:value={typeTravelerText}
			/>
		</Link>
		<Link class="half-width" href={href}>
			<TextInput
				labelText='Budget'
				bind:value={budget}
			/>
			<TextInput
				labelText='Update'
				bind:value={updated_at}
			/>
		</Link>
		{:else}
		<Link href={href}>
			<TextInput
				labelText='Departure'
				bind:value={depart_at}
			/>
		</Link>
		<Link href={href}>
			<TextInput
				labelText='Description'
				bind:value={trip.description}
			/>
		</Link>
		<Link class="half-width" href={href}>
			<TextInput
				labelText='Status'
				bind:value={ENUM_TRIP_STATE_LABEL[trip.state]}
			/>
			<TextInput
				labelText='Update'
				bind:value={updated_at}
			/>
		</Link>
		{/if}

	</div>
	{/each}
	
</div>

<style lang="scss">
	@use '../../../../styles/datatable';
</style>
