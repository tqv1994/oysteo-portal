<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';

	import type { Trip } from '$lib/store/trip';
	import {
		Button,
		DataTable,
		Link,
		OverflowMenu,
		OverflowMenuItem
	} from 'carbon-components-svelte';
	import type { DataTableHeader } from 'carbon-components-svelte/types/DataTable/DataTable';
	import {
		FolderOpen32,
		Forum32,
		Phone32,
		Slisor32,
		Star32,
		TrashCan32
	} from 'carbon-icons-svelte';
	let headers: DataTableHeader[] = [
		{
			key: 'created_at',
			value: 'Date',
			sort: (a, b) => new Date(a) - new Date(b)
		},
		{
			key: 'type',
			value: 'Type'
		},
		{
			key: 'description',
			value: 'Description'
		},
		{
			key: 'action',
			value: ''
		}
	];
	export let messages: {
		id: number;
		created_at: string;
		type: string;
		description: string;
		isRead: boolean;
	}[] = [
		{
			id: 1,
			created_at: '2021-09-01',
			type: 'PoolEnq',
			description: 'Chloe Dobbins',
			isRead: false
		},
		{
			id: 2,
			created_at: '2021-03-01',
			type: 'MbrEnq',
			description: 'OYSTEO Member–ChrisDubrowski',
			isRead: false
		},
		{
			id: 3,
			created_at: '2021-03-14',
			type: 'PoolEnq',
			description: 'Chloe Dobbins',
			isRead: true
		}
	];
	export let detailLinkPrefix: string = '/account/trips/trip-detail?id=';
</script>
<div>
<DataTable sortable bind:headers rows={messages} class="table-custom">
	<div slot="cell" let:cell let:row>
		{#if cell.key === 'action'}
			<div class="actions">
				<Button kind="ghost" icon={Star32} iconDescription="Like" />
				<Button kind="ghost" icon={Slisor32} iconDescription="Open" />
				<Button kind="ghost" icon={TrashCan32} iconDescription="Delete" />
				<Button kind="ghost" icon={FolderOpen32} iconDescription="Download" />
				<Button kind="ghost" icon={Phone32} iconDescription="Call" />
				<Button kind="ghost" icon={Forum32} iconDescription="Chat" />
			</div>
		{:else if cell.key === 'created_at'}
			<Link href={`#`}>
				<span class={`${!row.isRead ? 'active' : ''}`}>
					{formatDate(cell.value)}
				</span>
			</Link>
		{:else if cell.key === 'description'}
			<span class={`${!row.isRead ? 'active' : ''}`}>
				{cell.value}
			</span>
		{:else}
			<span class={`${!row.isRead ? 'active' : ''}`}>
				{cell.value}
			</span>
		{/if}
	</div>
</DataTable>
</div>
<style lang="scss">
	@use '../../../../styles/datatable';
	div {
		.active {
			font-weight: bold;
		}
		
        :global(td){
            :global(.actions) {
                visibility: hidden;
            }
            &:hover{
                :global(.actions) {
                    visibility: initial;
                }
            }
        }
	}
</style>
