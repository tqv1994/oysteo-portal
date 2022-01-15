<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';

	import type { Trip } from '$lib/store/trip';
	import {ENUM_TRIP_STATE_LABEL} from '$lib/store/trip';
	import { Button, DataTable, Link, OverflowMenu, OverflowMenuItem } from 'carbon-components-svelte';
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
</script>

<DataTable sortable bind:headers rows={trips} class="table-custom">
	<div slot="cell" let:cell let:row>
        
		{#if cell.key === 'action'}
			<Button kind="ghost" icon={Phone32} iconDescription="Call" />
			<Button kind="ghost" icon={Forum32} iconDescription="Chat" />
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

<style lang="scss">
	@use '../../../../styles/datatable';
</style>
