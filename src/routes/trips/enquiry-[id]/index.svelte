<script lang="ts" context="module">
	import DesktopNavigationSection from '$lib/components/navigation/desktop_nav_section.svelte';
	import NavigationSection from '$lib/components/navigation/modal.svelte';
	import type { Load } from '@sveltejs/kit';
	import { afterUpdate } from 'svelte';
	import OverlayLoading from '$lib/components/form/loading.svelte';
	import {
		type TripState,
		type Trip,
		tripStore,
		tripLeadStore
	} from '$lib/store/trip';
	import type { User } from '$lib/store/auth';
	import type { Traveller, travellersStore } from '$lib/store/traveller';
	import FormSection from '$lib/components/form/section.svelte';

	export const load: Load = async ({ session, params }) => {
		let trip: Trip;
		try {
			const res = await pget(fetch, `trips/${params.id}`);
			if (res.ok) {
				trip = await res.json();
			} else {
				console.error('Failed to fetch trips', await res.text());
			}
		} catch (err) {
			console.log('Error fetch trips:', err);
		}

		return { props: { trip } };
	};
</script>

<script lang="ts">
	import Accordion from '$lib/components/Accordion.svelte';
	import Status from '../trip-detail/components/Status.svelte';
	import TravellerSection from './components/Traveller.svelte';
	import Request from './components/Request.svelte';
	import { Button } from 'carbon-components-svelte';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import { pget, ppatch, ppost } from '$lib/utils/fetch';
	import { notify } from '$lib/components/Toast.svelte';
	import { session } from '$app/stores';
	import Insights from './components/Insights.svelte';
	import FormPage from '$lib/components/form/FormPage.svelte';
	import { redirect } from '$lib/helpers/redirect.svelte';

	export let trip: Trip;
	export let user: User;
	export let traveller: Traveller;

	let activeSection = '';
	let loadingLabel = 'Saving ...';
	let y, prevY;
	let navFixed = '';
	let activeLoading = false;
	let classHome = false;

	const setEditing = (sectionName: string) => () => {
		activeSection = sectionName;
	};

	const enquiriesSections = [
		{ id: 'status', text: 'Status' },
		{ id: 'traveler', text: 'Traveler' },
		{ id: 'request', text: 'Request' },
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

	const handleMakeTrip = async () => {
		try {
			const res = await ppost(`trip/accept`, {
				id: trip.id
			});
			if (res.ok) {
				trip = await res.json();
				tripStore.update((s) => {
					s.push(trip);
					return s;
				});
				goto('/trips/accepted');
			} else {
				notify({
					title: 'Update failed',
					subtitle: 'Failed to update information, please try again later.'
				});
			}
		} catch (error) {
			console.log(error);
			notify({
				title: 'Update failed',
				subtitle: 'Failed to update information, please try again later.'
			});
		}
	};

	const handleReject = async () => {
		try {
			const res = await ppost(`trip/reject`, {
				id: trip.id
			});

			if (res.ok) {
				trip = await res.json();
				tripStore.update((s) => {
					const idx = s.findIndex((t) => t.id === trip.id);
					s[idx] = trip;
					return s;
				});
				goto('/trips/enquiries');
			} else {
				notify({
					title: 'Reject failed',
					subtitle: 'Failed to update information, please try again later.'
				});
			}
		} catch (error) {
			console.log(error);
			notify({
				title: 'Reject failed',
				subtitle: 'Failed to update information, please try again later.'
			});
		}
	};
	
</script>

{#if trip}
	<FormPage title="Enquiries">
		<div class="content-actions text-right mb-15">
			<Button
				kind="secondary"
				size="field"
				class="pr-30 pl-30"
				on:click={() => {
					handleMakeTrip();
				}}>Accept</Button
			>
			{#if trip?.user != null && trip?.advisor != null}
				<Button
					kind="secondary"
					size="field"
					class="pr-30 pl-30"
					on:click={() => {
						handleReject();
					}}>Decline</Button
				>
			{/if}
		</div>
		<div class="section" id="status">
			<Accordion title="Status" open={true}>
				<Status bind:trip />
			</Accordion>
		</div>
		<FormSection title="Traveler" id="traveler">
			{#if trip?.travellers[0]}
				<TravellerSection bind:traveller={trip.travellers[0]} />
			{:else}
				<p>No traveler</p>
			{/if}
		</FormSection>
		<FormSection title="Request" id="request">
			<Request bind:trip />
		</FormSection>
		<FormSection title="Insights" id="insights">
			<Insights bind:traveller={trip.travellers[0]} />
		</FormSection>
	</FormPage>
{:else}
	<p class="note-not-found">No Trip</p>
{/if}
