<script lang="ts" context="module">
	import DesktopNavigationSection from '$lib/components/navigation/desktop_nav_section.svelte';
	import NavigationSection from '$lib/components/navigation/modal.svelte';
	import { afterUpdate } from 'svelte';
	import OverlayLoading from '$lib/components/form/loading.svelte';
	import Accordion from '$lib/components/Accordion.svelte';
	import { type Trip, TripState, tripStore, type TripGroup } from '$lib/store/trip';
	import TravelersList from './components/TravelersList.svelte';
	import EnquiriesList from './components/EnquiriesList.svelte';
	import type { TravellerGroup } from '$lib/store/traveller';
	import FormPage from '$lib/components/form/FormPage.svelte';
</script>

<script lang="ts">
	export let trips: Trip[];
	let loadingLabel = 'Saving ...';
	let y, prevY;
	let navFixed = '';
	let activeLoading = false;

	const travellerGroups: Record<string, TravellerGroup> = {
		new_enquiry: { id: 'new_enquiry', text: 'New Enquiry', trips: [] },
		planning: { id: 'planning', text: 'Planning', trips: [] },
		confirmed: { id: 'confirmed', text: 'Confirmed', trips: [] },
		travelling: { id: 'travelling', text: 'Travelling', trips: [] },
		registered: { id: 'registered', text: 'Registered', trips: [] }
	};

	let menuItems: TravellerGroup[];

	tripStore.subscribe((s) => {
		for (const id in travellerGroups) {
			travellerGroups[id].trips = [];
		}
		for (const traveller of s) {
			if (traveller.state in travellerGroups) {
				travellerGroups[traveller.state].trips.push(traveller);
			}
		}
		menuItems = Object.values(travellerGroups);
	});

	afterUpdate(() => {
		navFixed = prevY > y ? 'nav-fixed' : '';
		prevY = y;
	});
</script>

<OverlayLoading bind:activeLoading bind:label={loadingLabel} />
<FormPage title="Travellers">
	{#each menuItems as group}
		<div class="section" id={group.id}>
			{#if group.id == 'new_enquiry'}
				<Accordion title={group.text} open={true} id="">
					<EnquiriesList trips={group.trips} />
				</Accordion>
			{:else}
				<Accordion title={group.text} open={true} id="">
					<TravelersList trips={group.trips} />
				</Accordion>
			{/if}
		</div>
	{/each}
</FormPage>
