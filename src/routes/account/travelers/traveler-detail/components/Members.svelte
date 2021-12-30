<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';

	import { RELATIVES, RELATIVE_LABELS, Traveller } from '$lib/store/traveller';
	import { Column, Grid, Row } from 'carbon-components-svelte';
	import { get } from 'svelte/store';
	type TravellerRelative = Traveller & {
		relative: string;
	};
	export let traveller: Traveller;
	let members: TravellerRelative[] = [];
	for (const relative in RELATIVES) {
		if (relative === 'children' && traveller.children) {
			members.push({ ...traveller.children, relative });
		} else {
			if (traveller[relative]) {
				for (const travellerItem of traveller[relative]) {
					members.push({ ...travellerItem, relative });
				}
			}
		}
	}
	// const experiences = traveller.personalPreferences.reduce((item)=>{
	//     item.type
	// });
</script>

<div class="mt-15">
	<Grid narrow padding>
		<Row>
			<Column><label>Name</label></Column>
			<Column><label>DOB</label></Column>
			<Column><label>Relationship</label></Column>
			<Column><label>Passport</label></Column>
		</Row>
		{#each members as member}
			<Row>
				<Column>{`${member.forename || ''} ${member.surname || ''}`}</Column>
				<Column>{member.birthday ? formatDate(member.birthday) : ''}</Column>
				<Column>{RELATIVE_LABELS[member.relative]}</Column>
				<Column>{member.passportNumber || ''}</Column>
			</Row>
		{/each}
	</Grid>
</div>
