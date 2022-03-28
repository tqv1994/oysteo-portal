<script lang="ts" context="module">
	import DesktopNavigationSection from '$lib/components/navigation/desktop_nav_section.svelte';
	import NavigationSection from '$lib/components/navigation/modal.svelte';
	import type { Load } from '@sveltejs/kit';
	import { afterUpdate } from 'svelte';
	import OverlayLoading from '$lib/components/form/loading.svelte';
	import type { Metadata } from '$lib/store/metadata';
	import { ENUM_TRIP_STATE, Trip } from '$lib/store/trip';
	import { authStore, convertUserToInput, User, UserInput } from '$lib/store/auth';
	import type { Traveller } from '$lib/store/traveller';
	import FormSection from '$lib/components/form/section.svelte';
	import Members from './components/Members.svelte';

	export const load: Load = async ({ fetch, session, url }) => {
		try {
			let user: User | undefined = session.user;
			let metadata: Metadata = session.metadata;
			let traveller: Traveller;
			let userTraveller: User;
			let isMyTraveller = false;
			let trips: Trip[];
			const res = await fetch(`/traveller/${url.searchParams.get('id')}.json`);
			if (res.ok) {
				userTraveller = await res.json();
				const advisors: Advisor[] = userTraveller.myAdvisors;
				const index = advisors.findIndex((item) => item.id === user.advisorMe.id);
				if (index >= 0) {
					isMyTraveller = true;
				}
				traveller = userTraveller.travellerMe;
			} else {
				const error = await res.json();
				console.error(error);
			}

			const resTrips = await fetch(
				`/trip.json?lead_traveller=${url.searchParams.get('id')}&state=${
					ENUM_TRIP_STATE.new_enquiry
				}`
			);
			if (resTrips.ok) {
				const data: Trip[] = await resTrips.json();
				trips = data;
			} else {
				const error = await resTrips.json();
				console.error(error);
			}

			// await getTravellerService(url.searchParams.get('id')).then((travellerOutput)=>{
			//     traveller = travellerOutput;
			// }).catch(error=>{
			// 	console.log('test',error);
			// });
			// await Promise.all([getTravellerService(url.searchParams.get('id')),getTripsService(new TRipInput({advisor: url.searchParams.get('id')}))]).then(([travellerOutput, tripsOutput])=>{
			//     trips = tripsOutput;
			//     traveller = travellerOutput;
			// }).catch(([error1 ,error2])=>{
			//     console.error(error1, error2);
			// });
			return {
				props: {
					traveller,
					trips,
					userTraveller,
					isMyTraveller
				}
			};
		} catch (error) {
			console.log('Fetch advisor data:' + error);
		}
		return { props: {} };
	};
</script>

<script lang="ts">
	import Preferences from './components/Preferences.svelte';
	import Profile from './components/Profile.svelte';
	import Insights from './components/Insights.svelte';
	import TripsList from '../../trips/components/TripsList.svelte';
	import Accordion from '$lib/components/Accordion.svelte';
	import Notes from './components/Notes.svelte';
	import type { Advisor } from '$lib/store/advisor';
	import { updateUserService } from '$lib/services/user.service';

	export let trips: Trip[];
	export let traveller: Traveller;
	export let isMyTraveller: boolean;
	export let userTraveller: User;
	let tripsRegistered: Trip[] = trips.reduce((acc: Trip[], item: Trip) => {
		if (item.state === ENUM_TRIP_STATE.new_enquiry) {
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
		{ id: '', text: 'Home', link: '/account' },
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

	const handleOnRegister = async () => {
		window.openLoading(true);
		let userInput: UserInput = convertUserToInput(userTraveller);
		if ($authStore.user.advisorMe.id) {
			userInput.myAdvisors = userInput.myAdvisors.concat([$authStore.user.advisorMe.id + '']);
			await updateUserService(userTraveller.id, userInput)
				.then((user) => {
					isMyTraveller = true;
				})
				.catch((error) => {
					console.error(error);
				});
		}
		window.openLoading(false);
	};
</script>

<svelte:window bind:scrollY={y} />
<OverlayLoading bind:activeLoading bind:label={loadingLabel} />
<NavigationSection items={travelersSections} class={navFixed} />

<div class="content">
	<div class="title-content">
		<h1>Traveler Detail</h1>
		<DesktopNavigationSection items={travelersSections} className={'travelers-screen'} />
	</div>
	{#if traveller}
		<div class="section" id="home" />
		<FormSection
			title="Profile"
			id="profile"
			titleRightIcon={'Register'}
			rightIcon={!isMyTraveller ? true : false}
			on:add={() => {
				handleOnRegister();
			}}
		>
			<Profile bind:traveller />
		</FormSection>

		<FormSection title="Preferences" id="preferences">
			<Preferences bind:traveller />
		</FormSection>
		<FormSection title="Insights" id="insights">
			<Insights bind:user={userTraveller} />
		</FormSection>
		<div class="section" id="enquiries">
			<Accordion title="Enquiries" id="">
				{#if tripsRegistered && tripsRegistered.length > 0}
					<TripsList trips={tripsRegistered} detailLinkPrefix="/account/trips/enquiry-" />
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
