<script lang="ts" context="module">
	import 'carbon-components-svelte/css/all.css';
	import DesktopNavigationSection from '$lib/components/navigation/desktop_nav_section.svelte';
	import NavigationSection from '$lib/components/navigation/modal.svelte';
	import '$lib/utils/firebase';
	import type { Load } from '@sveltejs/kit';
	import { afterUpdate } from 'svelte';
	import OverlayLoading from '$lib/components/form/loading.svelte';
	import type { Metadata } from '$lib/store/metadata';
	import type { Trip } from '$lib/store/trip';
	import type { User } from '$lib/store/auth';
    import { getTravellerService } from '$lib/services/traveller.service';
    import { getTripsService } from '$lib/services/trip.services';
    import type { Traveller } from '$lib/store/traveller';
    import FormSection from '$lib/components/form/section.svelte';

	export const load: Load = async ({ fetch, session, page }) => {
		try {
			let user: User | undefined = session.user;
			let metadata: Metadata = session.metadata;
            let trip: Trip;
			const res = await fetch(`/trip/${page.params.id}.json`);
			if(res.ok){
				const data: Trip = await res.json();
				console.log(trip);
				trip = data;
			}else{
				const error = await res.json();
				console.error(error);
			}
			
            // await getTravellerService(page.query.get('id')).then((travellerOutput)=>{
            //     traveller = travellerOutput;
            // }).catch(error=>{
			// 	console.log('test',error);
			// });
            // await Promise.all([getTravellerService(page.query.get('id')),getTripsService(new TRipInput({advisor: page.query.get('id')}))]).then(([travellerOutput, tripsOutput])=>{
            //     trips = tripsOutput;
            //     traveller = travellerOutput;
            // }).catch(([error1 ,error2])=>{
            //     console.error(error1, error2);
            // });
            return { props:{
                trip
            }}
		} catch (error) {
			console.log('Fetch advisor data:' + error);
		}
        return { props:{}}
	};
</script>

<script lang="ts">
import Accordion from '$lib/components/Accordion.svelte';
import Status from '../trip-detail/components/Status.svelte';
import TravellerSection from './components/Traveller.svelte';
import Insights from '../../travelers/traveler-detail/components/Insights.svelte';
import Preferences from '../../travelers/traveler-detail/components/Preferences.svelte';
import Request from './components/Request.svelte';

	export let trip: Trip;
    let traveller: Traveller | undefined = trip.lead_traveller;
	// let tripsRegistered: Trip[] = trips.reduce((acc: Trip[], item: Trip)=>{
    //     if(item.state === 'enquired'){
    //         acc.push(item);
    //     }
    //     return acc;
    // },[]);

	let activeSection = '';
	let loadingLabel = 'Saving ...';
	let y, prevY;
	let navFixed = '';
	let activeLoading = false;

	const setEditing = (sectionName: string) => () => {
		activeSection = sectionName;
	};

	const enquiriesSections = [
		{ id: '', text: 'Home', link: '/account' },
		{ id: 'traveler', text: 'Traveler' },
		{ id: 'request', text: 'Request' },
		{ id: 'preferences', text: 'Preferences' },
        { id: 'insights', text: 'Insights' }
	];

	let invalidDateVisited = {
		status: false,
		message: 'Invalid date'
	};

	afterUpdate(() => {
		navFixed = prevY > y ? 'nav-fixed' : '';
		prevY = y;
	});
</script>

<svelte:window bind:scrollY={y} />
<OverlayLoading bind:activeLoading bind:label={loadingLabel} />
<NavigationSection items={enquiriesSections} class={navFixed} />

<div class="content">
	<div class="title-content">
		<h1>Traveler Detail</h1>
		<DesktopNavigationSection items={enquiriesSections} className={'enquiries-screen'} />
	</div>
	{#if trip}
	<Accordion title="Status" open={true} id="">
		<Status bind:trip/>
	</Accordion>
	<FormSection title="Traveler" id="traveler" icon="">
		{#if traveller}
        	<TravellerSection bind:traveller />
		{/if}
	</FormSection>
	<FormSection title="Request" id="request" icon="">
		<Request bind:trip />
	</FormSection>
	<FormSection title="Preferences" id="traveler" icon="">
		{#if traveller}
        	<Preferences bind:traveller />
		{/if}
	</FormSection>
	<FormSection title="Insights" id="insights" icon="">
        <Insights bind:traveller />
	</FormSection>
	{/if}
	<div id="fake-height" />
</div>
