<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';
	import { sortDate } from '$lib/utils/sort';
	import {
		Button,
		Column,
		DataTable,
		Link,
		OverflowMenu,
		OverflowMenuItem,
		Row
	} from 'carbon-components-svelte';
	import type { DataTableHeader } from 'carbon-components-svelte/types/DataTable/DataTable.svelte';
	import {
		Email as EmailIcon,
		EmailNew as EmailNewIcon,
		FolderOpen as FolderOpenIcon,
		Forum as ForumIcon,
		Phone as PhoneIcon,
		Slisor as SlisorIcon,
		Star as StarIcon,
		TrashCan as TrashCanIcon
	} from 'carbon-icons-svelte';
	let headers: DataTableHeader[] = [
		{
			key: 'created_at',
			value: 'Date',
			sort: sortDate
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
	export let detailLinkPrefix = '/trips/trips/trip-detail?id=';
</script>

<div>
	<DataTable sortable bind:headers rows={messages} class="table-custom">
		<div slot="cell" let:cell let:row>
			{#if cell.key === 'action'}
				<div class="actions">
					<Button kind="ghost" size="lg" icon={StarIcon} iconDescription="Like" />
					<Button kind="ghost" size="lg" icon={SlisorIcon} iconDescription="Open" />
					<Button kind="ghost" size="lg" icon={TrashCanIcon} iconDescription="Delete" />
					<Button kind="ghost" size="lg" icon={FolderOpenIcon} iconDescription="Download" />
					<Button kind="ghost" size="lg" icon={PhoneIcon} iconDescription="Call" />
					<Button kind="ghost" size="lg" icon={ForumIcon} iconDescription="Chat" />
				</div>
			{:else if cell.key === 'created_at'}
				<Link href={`#`}>
					<span class={`${!row.isRead ? 'active fix-width-date' : ''}`}>
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
<div class="mobile-table">
	{#each messages as message}
		<div class="data-message">
			<Row>
				<Column class="col-button" lg={1}>
					<Row>
						{#if message.isRead}
							<EmailIcon sizr={24} />
						{:else}
							<EmailNewIcon sizr={24} />
						{/if}
					</Row>
					<Row>
						<StarIcon sizr={24} />
					</Row>
				</Column>
				<Column>
					<Row>
						<span class={`${!message.isRead ? 'active' : ''}`}>
							{formatDate(message.created_at)}
						</span>
					</Row>
					<Row>
						<span class={`${!message.isRead ? 'active' : ''}`}>
							{message.type}
						</span>
					</Row>
					<Row>
						<span class={`${!message.isRead ? 'active' : ''}`}>
							{message.description}
						</span>
					</Row>
				</Column>
				<Column class="col-button" lg={1}>
					<OverflowMenu open flipped>
						<OverflowMenuItem text="Delete" />
						<OverflowMenuItem text="Archive" />
						<OverflowMenuItem text="Call" />
						<OverflowMenuItem text="Message" />
					</OverflowMenu>
				</Column>
			</Row>
		</div>
	{/each}
</div>

<style lang="scss">
	div {
		.active {
			font-weight: bold;
		}

		:global(td) {
			:global(.actions) {
				visibility: hidden;
			}
			&:hover {
				:global(.actions) {
					visibility: initial;
				}
			}
		}

		.fix-width-date {
			width: 140px;
		}
	}
</style>
