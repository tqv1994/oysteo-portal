<script lang="ts" context="module">
	import DesktopNavigationSection from '$lib/components/navigation/desktop_nav_section.svelte';
	import NavigationSection from '$lib/components/navigation/modal.svelte';
	import type { Load } from '@sveltejs/kit';
	import { afterUpdate } from 'svelte';
	import OverlayLoading from '$lib/components/form/loading.svelte';
	import type { Metadata } from '$lib/store/metadata';
	import { TripState, type Trip, tripStore } from '$lib/store/trip';
	import type { User } from '$lib/store/auth';
	import FormSection from '$lib/components/form/section.svelte';

	export const load: Load = async ({ fetch, session, params }) => {
		let travelPreferenceTypes = await getCollection(fetch, 'travel-preference-type');
		let personalPreferenceTypes = await getCollection(fetch, 'personal-preference-type');

		let traveller: Traveller;
		try {
			const res = await pget(fetch, `travellers/${params.id}`);
			if (res.ok) {
				traveller = await res.json();
			} else {
				console.error('Failed to fetch traveller', await res.text());
			}
		} catch (err) {
			console.log('Error fetch traveller:', err);
		}

		return { props: { traveller, travelPreferenceTypes, personalPreferenceTypes } };
	};
</script>

<script lang="ts">
	import Accordion from '$lib/components/Accordion.svelte';
	import type { Advisor } from '$lib/store/advisor';
	import { pget, ppatch, ppost } from '$lib/utils/fetch';
	import { get } from 'svelte/store';
	import { redirect } from '$lib/helpers/redirect.svelte';
	import { getCollection } from '$lib/store/collection';
	import type { Kind } from '$lib/store/category';
	import type { Agency } from '$lib/store/agency';
	import type { Traveller, travellersStore } from '$lib/store/traveller';
	import { session } from '$app/stores';
	import Profile from './components/Profile.svelte';
	import Preferences from './components/Preferences.svelte';
	import Insights from './components/Insights.svelte';
	import Members from './components/Members.svelte';
	import Notes from './components/Notes.svelte';
	import { goto } from '$app/navigation';
	import TripsList from '../components/TripsList.svelte';
	import { notify } from '$lib/components/Toast.svelte';

	export let traveller: Traveller;
	export let isMyTraveller: boolean;
	export let travelPreferenceTypes: Kind[];
	export let personalPreferenceTypes: Kind[];

	const trips = $tripStore;
	let tripsRegistered = (trips || []).reduce((acc: Trip[], item: Trip) => {
		if (item?.travellers[0]?.id == traveller.id) {
			acc.push(item);
		}
		return acc;
	}, []);

	let activeSection = '';
	let loadingLabel = 'Saving ...';
	let y, prevY;
	let navFixed = '';
	let activeLoading = false;

	const setEditing = (sectionName: string) => () => {
		activeSection = sectionName;
	};

	const travelersSections = [
		{ id: 'profile', text: 'Profile' },
		{ id: 'preferences', text: 'Preferences' },
		{ id: 'insights', text: 'Insights' },
		{ id: 'enquiries', text: 'Enquiries' },
		{ id: 'group-members', text: 'Group Members' },
		{ id: 'notes', text: 'Notes' }
	];

	let invalidDateVisited = {
		status: false,
		message: 'Invalid date'
	};

	afterUpdate(() => {
		navFixed = prevY > y ? 'nav-fixed' : '';
		prevY = y;
	});

	async function createNewTrip() {
		try {
			const res = await ppost(`trips?advisor=${$session.advisorMe.id}`, {
				travellers: [traveller.id]
			});
			if (res.ok) {
				const trip = await res.json();
				tripStore.update((s) => {
					s.push(trip);
					return s;
				});
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

<svelte:window bind:scrollY={y} />
<OverlayLoading bind:activeLoading bind:label={loadingLabel} />
<NavigationSection items={travelersSections} class={navFixed} />

<div class="content">
	<div class="title-content">
		<h1>Traveler Detail</h1>
		<DesktopNavigationSection items={travelersSections} class="travelers-screen" />
	</div>
	{#if traveller}
		<div class="section" id="home" />
		<FormSection
			title="Profile"
			id="profile"
			actionLabel={'Register'}
			on:add={() => {
				createNewTrip();
			}}
		>
			<Profile bind:traveller />
		</FormSection>

		<FormSection title="Preferences" id="preferences">
			<Preferences {travelPreferenceTypes} {personalPreferenceTypes} bind:traveller />
		</FormSection>
		<FormSection title="Insights" id="insights">
			<Insights bind:traveller />
		</FormSection>
		<div class="section" id="enquiries">
			<Accordion title="Enquiries" id="">
				{#if tripsRegistered && tripsRegistered.length > 0}
					<TripsList trips={tripsRegistered} detailLinkPrefix="/trips/enquiry-" />
				{/if}
			</Accordion>
		</div>
		<FormSection title="Group Members" id="group-members">
			<Members bind:traveller />
		</FormSection>

		<FormSection title="Notes" id="notes">
			<Notes bind:traveller />
		</FormSection>
	{/if}
	<div id="fake-height" />
</div>
