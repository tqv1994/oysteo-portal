<script lang="ts">
	import OverlayLoading from '$lib/components/form/loading.svelte';
	import Accordion from '$lib/components/Accordion.svelte';
	import TripsList from './components/TripsList.svelte';
	import { Button } from 'carbon-components-svelte';
	import { goto } from '$app/navigation';
	import FormPage from '$lib/components/form/FormPage.svelte';
	import { type TripGroup, tripStore } from '$lib/store/trip';
	import { ppost } from '$lib/utils/fetch';
	import { session } from '$app/stores';
	import { notify } from '$lib/components/Toast.svelte';

	const tripGroups: Record<string, TripGroup> = {
		planning: { id: 'planning', text: 'Planning', trips: [] },
		confirmed: { id: 'confirmed', text: 'Confirmed', trips: [] },
		travelling: { id: 'travelling', text: 'Travelling', trips: [] },
		returned: { id: 'returned', text: 'Returned', trips: [] },
		canceled: { id: 'canceled', text: 'Canceled', trips: [] }
	};

	let loadingLabel = 'Saving ...';
	let activeLoading = false;
	let menuItems: TripGroup[];

	tripStore.subscribe((s) => {
		for (const id in tripGroups) {
			tripGroups[id].trips = [];
		}
		for (const trip of s) {
			if (trip.state in tripGroups) {
				tripGroups[trip.state].trips.push(trip);
			}
		}
		menuItems = Object.values(tripGroups);
	});

	async function createNewTrip() {
		try {
			const res = await ppost(`trips?advisor=${$session.advisorMe?.id}`, {});
			if (res.ok) {
				const trip = await res.json();
				goto(`/trips/${trip.id}`);
			} else {
				notify({
					title: 'An error has occured',
					subtitle:
						'Something unexpected has happened. Please refresh the browser and sign-in again.'
				});
				console.error(await res.text());
			}
		} catch (err) {
			notify({
				title: 'An error has occured',
				subtitle: 'Something unexpected has happened. Please try again later.'
			});
			console.error(err);
		}
	}
</script>

<OverlayLoading bind:activeLoading bind:label={loadingLabel} />
<FormPage title="Trips">
	<div class="content-actions text-right mb-15">
		<Button
			kind="secondary"
			size="field"
			class="pr-30 pl-30"
			on:click={createNewTrip}>Create New Trip</Button
		>
	</div>
	{#each menuItems as group}
		<div class="section" id={group.id}>
			<Accordion title={group.text} open={true} id="">
				<TripsList trips={group.trips} />
			</Accordion>
		</div>
	{/each}
</FormPage>
