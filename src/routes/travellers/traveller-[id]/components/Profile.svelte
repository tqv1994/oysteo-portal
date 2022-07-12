<script lang="ts">
	import type { Traveller } from '$lib/store/traveller';

	import { Column, Grid, Link, Row } from 'carbon-components-svelte';
	import { Forum as ForumIcon } from 'carbon-icons-svelte';

	export let traveller: Traveller;
</script>

<div class="mt-15 desktop-profile">
	<Grid narrow padding>
		<Row>
			<Column><label>Name</label></Column>
			<Column><label>Language</label></Column>
			<Column><label>Phone</label></Column>
			<Column><label>Pref. Contact</label></Column>
			<Column><label>Email</label></Column>
			<Column lg={1} />
		</Row>
		<Row>
			<Column>{`${traveller.forename || ''} ${traveller.surname || ''}`}</Column>
			<Column>{traveller.language || ''}</Column>
			<Column>{traveller.mobilePhone || ''}</Column>
			<Column>{traveller.whatsapp || ''}</Column>
			<Column>{traveller.email || ''}</Column>
			<Column lg={1}><Link href="#"><ForumIcon size={16} /></Link></Column>
		</Row>
		<Row>
			<Column><label>Country</label></Column>
			<Column><label>Address</label></Column>
			<Column><label>Time Zone</label></Column>
			<Column><label>Age</label></Column>
			<Column />
			<Column lg={1} />
		</Row>
		<Row>
			<Column>{traveller.residence?.name || ''}</Column>
			<Column>
				{#if traveller.address}
					{`${traveller.address.line1 || ''}, ${traveller.address.province || ''}, ${
						traveller.address.country?.code || ''
					} ${traveller.address.postcode || ''}`}
				{/if}
			</Column>
			<Column>{''}</Column>
			<Column>{new Date().getFullYear() - new Date(traveller.birthday).getFullYear()}</Column>
			<Column />
			<Column lg={1} />
		</Row>
	</Grid>
	<Grid narrow padding>
		<Row>
			<Column><label>Profile Description</label></Column>
		</Row>
		<Row>
			<Column>{''}</Column>
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
				<ForumIcon size={32} />
			</div>
		</Row>
		<Column>
			<Row><label>Country: {traveller.residence?.name || ''}</label></Row>
			<Row
				><label
					>Address:
					{#if traveller.address}
						{`${traveller.address.line1 || ''}, ${traveller.address.province || ''}, ${
							traveller.address.country?.code || ''
						} ${traveller.address.postcode || ''}`}
					{/if}</label
				></Row
			>
			<Row><label>Time Zone: {''}</label></Row>
			<Row
				><label
					>Age: {new Date().getFullYear() - new Date(traveller.birthday).getFullYear()}
				</label></Row
			>
		</Column>
		<Column>
			<Row><label>Profile Description: {''}</label></Row>
		</Column>
	</Grid>
</div>

<style lang="scss">
	div {
		:global(.bx--row) {
			margin-bottom: 0;
		}
	}
</style>
