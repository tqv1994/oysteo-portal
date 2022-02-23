<script lang="ts">
	import type { Traveller } from '$lib/store/traveller';

	import { Button, Column, Grid, Link, Row } from 'carbon-components-svelte';
	import { Forum16, Forum32 } from 'carbon-icons-svelte';

	export let traveller: Traveller;
</script>

<div class="mt-15">
	<Grid narrow padding>
		<Row>
			<Column class="custom-col"><label>Name</label></Column>
			<Column>{`${traveller.forename || ''} ${traveller.surname || ''}`}</Column>
		</Row>
		<Row>
			<Column  class="custom-col"><label>Language</label></Column>
			<Column>{traveller.language || ''}</Column>
		</Row>
		<Row>
			<Column  class="custom-col"><label>Phone</label></Column>
			<Column>{traveller.mobilePhone || ''}</Column>
		</Row>
		<Row>
			<Column  class="custom-col"><label>Pref. Contact</label></Column>
			<Column>{traveller.whatsapp || ''}</Column>
		</Row>
		<Row>
			<Column  class="custom-col"><label>Email</label></Column>
			<Column>{traveller.email || ''}</Column>
		</Row>
	</Grid>
</div>

<style lang="scss">
	div {
		:global(.bx--row) {
			margin-bottom: 0;
		}
		:global(.custom-col){
			margin-right: -225px;
		}
	}
</style>
