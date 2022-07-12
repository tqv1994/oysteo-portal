<script lang="ts" context="module">
	import DesktopNavigationSection from '$lib/components/navigation/desktop_nav_section.svelte';
	import NavigationSection from '$lib/components/navigation/modal.svelte';
	import { afterUpdate } from 'svelte';
	import OverlayLoading from '$lib/components/form/loading.svelte';
	import Accordion from '$lib/components/Accordion.svelte';
	import TripsList from './components/TripsList.svelte';
	import { type Trip, TripState, tripStore, tripLeadStore } from '$lib/store/trip';
	import FormPage from '$lib/components/form/FormPage.svelte';
</script>

<script lang="ts">
	export let trips: Trip[];
	let loadingLabel = 'Saving ...';
	let y, prevY;
	let navFixed = '';
	let activeLoading = false;

	const newEnquiries: Trip[] = [];
	const enquiries: Trip[] = [];
	tripStore.subscribe((s) => {
		newEnquiries.length = 0;
		enquiries.length = 0;
		for (const t of s) {
			switch (t.state) {
				case TripState.new_enquiry:
					if (t.advisor != null) {
						newEnquiries.push(t);
					}
					break;
				case TripState.enquired:
					enquiries.push(t);
					break;
			}
		}
	});

	afterUpdate(() => {
		navFixed = prevY > y ? 'nav-fixed' : '';
		prevY = y;
	});
</script>

<FormPage title="Enquiries">
	<div class="section" id="new_enquiry">
		<Accordion title="New Enquiry" open={true} id="">
			{#if newEnquiries.length}
				<TripsList noCTA={true} detailLinkPrefix="/trips/enquiry-" trips={newEnquiries} />
			{/if}
		</Accordion>
	</div>
	<div class="section" id="enquiried">
		<Accordion title="Registered" open={true} id="">
			{#if enquiries.length}
				<TripsList detailLinkPrefix="/trips/enquiry-" trips={enquiries} />
			{/if}
		</Accordion>
	</div>
	<div class="section" id="leads">
		<Accordion title="Leads" open={true} id="">
			{#if $tripLeadStore.length}
				<TripsList detailLinkPrefix="/trips/enquiry-" trips={$tripLeadStore} leads={true} />
			{/if}
		</Accordion>
	</div>
</FormPage>
