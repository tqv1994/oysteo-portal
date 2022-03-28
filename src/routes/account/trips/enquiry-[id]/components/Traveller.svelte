<script lang="ts">
	import type { Traveller } from '$lib/store/traveller';

	import { Button, Column, Grid, Link, Row } from 'carbon-components-svelte';
	import { Forum16, Forum32 } from 'carbon-icons-svelte';

	export let traveller: Traveller;
</script>

<div class="mt-15 desktop-profile">
	<Grid narrow padding>
		<Row>
			<Column class="custom-col" lg={3}><label>Name</label></Column>
			<Column>{`${traveller.forename || ''} ${traveller.surname || ''}`}</Column>
		</Row>
		<Row>
			<Column class="custom-col" lg={3}><label>Language</label></Column>
			<Column>{traveller.language || ''}</Column>
		</Row>
		<Row>
			<Column class="custom-col" lg={3}><label>Phone</label></Column>
			<Column>{traveller.mobilePhone || ''}</Column>
		</Row>
		<Row>
			<Column class="custom-col" lg={3}><label>Pref. Contact</label></Column>
			<Column>{traveller.whatsapp || ''}</Column>
		</Row>
		<Row>
			<Column class="custom-col" lg={3}><label>Email</label></Column>
			<Column>{traveller.email || ''}</Column>
		</Row>
	</Grid>
</div>

<div class="mt-15 mobile-profile">
	<Grid narrow padding>
		<Row>
			<Column class="custom-col">
				<Row><label>Name: {` ${traveller.forename || ''} ${traveller.surname || ''}`}</label></Row>
				<Row><label>Language: {traveller.language || ''}</label></Row>
				<Row><label>Phone: {traveller.mobilePhone || ''}</label></Row>
				<Row><label>Pref. Contact: {traveller.whatsapp || ''}</label></Row>
				<Row><label>Email: {traveller.email || ''}</label></Row>
			</Column>
			<div class="mobile-icon">
				<Forum32 />
			</div>
		</Row>
	</Grid>
</div>

<style lang="scss">
	div {
		:global(.bx--row) {
			margin-bottom: 0;
		}
	}
</style>
