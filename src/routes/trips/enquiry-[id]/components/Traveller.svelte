<script lang="ts">
	import type { Traveller } from '$lib/store/traveller';

	import { Button, Column, Grid, Link, Row } from 'carbon-components-svelte';
	import { Forum as ForumIcon } from 'carbon-icons-svelte';

	export let travellers: Traveller[] = [];
</script>

<div class="mt-15 ml-2 desktop-profile">
	<Grid narrow padding>
		<Row>
			<Column>
				<Row class="label-12">Name</Row>
			</Column>
			<Column>
				<Row class="label-12">Language</Row>
			</Column>
			<Column>
				<Row class="label-12">Phone</Row>
			</Column>
			<Column>
				<Row class="label-12">Pref. Contact</Row>
			</Column>
			<Column>
				<Row class="label-12">Email</Row>
			</Column>
		</Row>
		{#each travellers as traveller}
		<Row>
			<Column><Row>{` ${traveller.forename || ''} ${traveller.surname || ''}`}</Row></Column>
			<Column><Row>{traveller.language || ''}</Row></Column>
			<Column><Row>{traveller.mobilePhone || ''}</Row></Column>
			<Column><Row>{traveller.whatsapp || ''}</Row></Column>
			<Column><Row>{traveller.email || ''}</Row></Column>
		</Row>
		
		{/each}
	</Grid>
</div>

<div class="mt-15 mobile-profile">
	<Grid narrow padding>
		<Row>
			{#each travellers as traveller}
			<Column class="custom-col">
				<Row><label>Name: {` ${traveller.forename || ''} ${traveller.surname || ''}`}</label></Row>
				<Row><label>Language: {traveller.language || ''}</label></Row>
				<Row><label>Phone: {traveller.mobilePhone || ''}</label></Row>
				<Row><label>Pref. Contact: {traveller.whatsapp || ''}</label></Row>
				<Row><label>Email: {traveller.email || ''}</label></Row>
			</Column>
			{/each}
			<div class="mobile-icon">
				<ForumIcon size={32} />
			</div>
		</Row>
	</Grid>
</div>

<style lang="scss">
	// @use '../../../../../styles/grid';

	div {
		:global(.bx--row) {
			margin-bottom: 0;
		}
		label {
			font-size: 14px;
		}
	}
</style>
