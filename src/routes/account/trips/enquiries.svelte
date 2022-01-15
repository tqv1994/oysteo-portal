<script lang="ts" context="module">
	import 'carbon-components-svelte/css/all.css';
	import DesktopNavigationSection from '$lib/components/navigation/desktop_nav_section.svelte';
	import NavigationSection from '$lib/components/navigation/modal.svelte';
	import '$lib/utils/firebase';
	import type { Load } from '@sveltejs/kit';
	import { afterUpdate } from 'svelte';
	import OverlayLoading from '$lib/components/form/loading.svelte';
	import type { Metadata } from '$lib/store/metadata';
	import Accordion from '$lib/components/Accordion.svelte';
	import TripsList from './components/TripsList.svelte';
	import { ENUM_TRIP_STATE, Trip } from '$lib/store/trip';
	import type { User } from '$lib/store/auth';

	export const load: Load = async ({ fetch, session }) => {
		try {
			let user: User | undefined = session.user;
			let metadata: Metadata = session.metadata;
            let trips: Trip[] = [];
			const queryString = objectToQueryString({ advisor: user.advisorMe.id, state: ENUM_TRIP_STATE.enquired });
			const res = await fetch(`/trip.json?${queryString}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			if (res.ok) {
				const data = await res.json();
				trips = data;
			} else {
				const error = await res.json();
				console.error(error);
			}

            const queryNewTripString = objectToQueryString({state: ENUM_TRIP_STATE.new_enquiry });
			const resNewTrip = await fetch(`/trip.json?${queryNewTripString}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			if (resNewTrip.ok) {
				const data = await resNewTrip.json();
				trips = trips.concat(data);
			} else {
				const error = await res.json();
				console.error(error);
			}
            return {
                props: {
                    user: user,
                    trips
                }
            };
		} catch (error) {
			console.log('Fetch advisor data:' + error);
		}
		return { props: {} };
	};
</script>

<script lang="ts">
	import { Button } from 'carbon-components-svelte';
	import { goto } from '$app/navigation';
	import { objectToQueryString } from '$lib/helpers/utils';

	export let user: User;
	export let trips: Trip[] = [];
    let tripsNewRequiry: Trip[] = trips.reduce((acc: Trip[], item: Trip) => {
		if (item.state === ENUM_TRIP_STATE.new_enquiry) {
			acc.push(item);
		}
		return acc;
	}, []);
	let tripsRequired: Trip[] = trips.reduce((acc: Trip[], item: Trip) => {
		if (item.state === ENUM_TRIP_STATE.enquired) {
			acc.push(item);
		}
		return acc;
	}, []);
	let activeSection = '';
	let loadingLabel = 'Saving ...';
	let y, prevY;
	let navFixed = '';
	let activeLoading = false;
	const type = 'advisor';

	const setEditing = (sectionName: string) => () => {
		activeSection = sectionName;
	};

	const tripsSections = [
		{ id: '', text: 'Home', link: '/account' },
		{ id: 'new_enquiry', text: 'New Enquiry' },
		{ id: 'enquiried', text: 'Registered' }
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
<NavigationSection items={tripsSections} class={navFixed} />

<div class="content">
	<div class="title-content">
		<h1>Trips</h1>
		<DesktopNavigationSection items={tripsSections} className={'trips-screen'} />
	</div>
	<Accordion title="New Enquiry" open={true} id="new_enquiry">
        {#if tripsNewRequiry.length > 0}
		    <TripsList detailLinkPrefix="/account/trips/enquiry-" trips={tripsNewRequiry} />
        {/if}
	</Accordion>
    <Accordion title="Registered" open={true} id="enquiried">
        {#if tripsRequired.length > 0}
		    <TripsList detailLinkPrefix="/account/trips/enquiry-" trips={tripsRequired} />
        {/if}
	</Accordion>
	<div id="fake-height" />
</div>
