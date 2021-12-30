<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';

	import type { Trip } from '$lib/store/trip';
	import { Button, DataTable, Link, OverflowMenu, OverflowMenuItem } from 'carbon-components-svelte';
	import type { DataTableHeader } from 'carbon-components-svelte/types/DataTable/DataTable';
	import { Forum32, Phone32 } from 'carbon-icons-svelte';
	let headers: DataTableHeader[] = [
		{
			key: 'lead_traveller.forename',
			value: 'Client name'
		},
		{
			key: 'depart_at',
			value: 'Dparture',
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
	export let detailLinkPrefix: string = '/account/trips/trip-detail?id=';
</script>

<DataTable sortable bind:headers rows={trips} class="table-custom">
	<div slot="cell" let:cell let:row>
        
		{#if cell.key === 'action'}
			<Button kind="ghost" icon={Phone32} iconDescription="Call" />
			<Button kind="ghost" icon={Forum32} iconDescription="Chat" />
        {:else if cell.key === 'lead_traveller.forename'}
			{#if row.lead_traveller}
			<Link href={`${detailLinkPrefix}${row.id}`}>
            	{`${row.lead_traveller.forename || ''} ${row.lead_traveller.surname || ''}`}
			</Link>
			{/if}
        {:else if cell.key === 'state'}
            {cell.value}
        {:else if cell.key === 'depart_at'}
			<Link href={`${detailLinkPrefix}${row.id}`}>
				{cell.value ? formatDate(cell.value) : ''}
			</Link>
        {:else if cell.key === 'updated_at'}
            {cell.value ? formatDate(cell.value) : ''}
        {:else if cell.key === 'description'}
            <p style="width: 150px">{cell.value || ''}</p>
		{:else}{cell.value}{/if}
	</div>
</DataTable>

<style lang="scss">
	@use '../../../../styles/datatable';
</style>
