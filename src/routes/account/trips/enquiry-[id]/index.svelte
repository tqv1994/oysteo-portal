<script lang="ts" context="module">
	import 'carbon-components-svelte/css/all.css';
	import DesktopNavigationSection from '$lib/components/navigation/desktop_nav_section.svelte';
	import NavigationSection from '$lib/components/navigation/modal.svelte';
	import '$lib/utils/firebase';
	import type { Load } from '@sveltejs/kit';
	import { afterUpdate } from 'svelte';
	import OverlayLoading from '$lib/components/form/loading.svelte';
	import type { Metadata } from '$lib/store/metadata';
	import { ENUM_TRIP_STATE, Trip, TRipInput } from '$lib/store/trip';
	import type { User } from '$lib/store/auth';
	import { getTravellerService } from '$lib/services/traveller.service';
	import { getTripsService, updateTripService } from '$lib/services/trip.services';
	import type { Traveller } from '$lib/store/traveller';
	import FormSection from '$lib/components/form/section.svelte';

	export const load: Load = async ({ fetch, session, params }) => {
		
		try {
			let user: User | undefined = session.user;
			let metadata: Metadata = session.metadata;
			
			let trip: Trip;
			let userTraveller: User;
			// const res = await fetch(`/trip/${params.id}.json`);
			const res = await fetch(`/trip/${params.id}.json`);
			
			if (res.ok) {
				const data: Trip = await res.json();
				trip = data;
			} else {
				const error = await res.json();
				console.error(error);
			}
			
			if(trip.lead_traveller){
				const resUser = await fetch(`/traveller/${trip.lead_traveller.id}.json`);
				if (resUser.ok) {
					const data: User = await resUser.json();
					userTraveller = data;
				} else {
					const error = await res.json();
					console.error(error);
				}
			}
			return {
				props: {
					trip,
					user,
					userTraveller
				}
			};
		} catch (error) {
			console.log('Fetch advisor data: ' + error);
		}
		return { props: {} };
	};
</script>

<script lang="ts">
	import Accordion from '$lib/components/Accordion.svelte';
	import Status from '../trip-detail/components/Status.svelte';
	import TravellerSection from './components/Traveller.svelte';
	import Insights from '../../travelers/traveler-detail/components/Insights.svelte';
	import Preferences from '../../travelers/traveler-detail/components/Preferences.svelte';
	import Request from './components/Request.svelte';
	import { Button } from 'carbon-components-svelte';
	import { goto } from '$app/navigation';

	export let trip: Trip;
	export let user: User;
	export let userTraveller: User;
	let traveller: Traveller | undefined = trip?.lead_traveller;

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
		{ id: 'status', text: 'Status' },
		{ id: 'traveler', text: 'Traveler' },
		{ id: 'request', text: 'Request' },
		// { id: 'preferences', text: 'Preferences' },
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

	const handleMakeTrip = async() => {
		window.openLoading(true);
		await updateTripService(trip.id,new TRipInput({advisor: user.advisorMe.id,state: ENUM_TRIP_STATE.planning})).then((tripOutput)=>{
			trip.advisor = tripOutput.advisor;
			trip.state = tripOutput.state;
		}).catch((error)=>{
			console.error(error);
		});
		goto('/account/trips');
		window.openLoading(false);
	}
	
	const handleReject = async() => {
		window.openLoading(true);
		await updateTripService(trip.id,new TRipInput({advisor: user.advisorMe.id,state: ENUM_TRIP_STATE.enquired})).then((tripOutput)=>{
			trip.advisor = tripOutput.advisor;
			trip.state = tripOutput.state;
		}).catch((error)=>{
			console.error(error);
		});
		goto('/account/trips/enquiries');
		window.openLoading(false);
	}
	
</script>

<svelte:window bind:scrollY={y} />
<OverlayLoading bind:activeLoading bind:label={loadingLabel} />
<NavigationSection selectedItem={'Status'} items={enquiriesSections} class={navFixed} />
<div class="content">
	<div class="title-content">
		<h1>Enquiries</h1>
		<DesktopNavigationSection items={enquiriesSections} className={'enquiries-screen'} />
	</div>
	{#if (typeof(trip.advisor?.id) === 'undefined') || trip.advisor?.id !== user.advisorMe.id}
	<div class="content-actions text-right mb-15">
		<Button
			kind="secondary"
			size="field"
			class="pr-30 pl-30"
			on:click={() => {handleMakeTrip()}}>Accept</Button
		>
		<Button
			kind="secondary"
			size="field"
			class="pr-30 pl-30"
			on:click={() => {handleReject()}}>Reject</Button
		>
	</div>
	{/if}
	{#if trip}
		<div class="section home" id="home"></div>
		<div class="section" id="status">
			<Accordion title="Status" open={true} id="">
				<Status bind:trip />
			</Accordion>
		</div>
		<FormSection title="Traveler" id="traveler" icon="">
			{#if traveller}
				<TravellerSection bind:traveller />
			{/if}
		</FormSection>
		<FormSection title="Request" id="request" icon="">
			<Request bind:trip />
		</FormSection>
		<FormSection title="Insights" id="insights" icon="">
			<Insights bind:user={userTraveller} />
		</FormSection>
	{/if}
	<div id="fake-height" />
</div>
