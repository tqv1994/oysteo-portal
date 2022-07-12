<script lang="ts">
	import type { Advisor } from '$lib/store/advisor';
	import type { Traveller } from '$lib/store/traveller';
	import type { Trip } from '$lib/store/trip';
	import FormRow from '../../form/row.svelte';
	import TripTravellerForm from './TripTravellerForm.svelte';

	export let trip: Trip;
	export let activeSection = '';
	let travellers = trip.travellers;
</script>

<FormRow label="" class={'mbottom-32'} contentClass={'mtop-d16 list-advisors'}>
	<div slot="value">
		{#each travellers as traveller}
			{#if traveller.userMe == null}
				<TripTravellerForm {traveller} {trip} bind:activeSection />
			{/if}
		{/each}
	</div>
</FormRow>
