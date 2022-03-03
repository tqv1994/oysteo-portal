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
	import { ENUM_TRIP_STATE, Trip } from '$lib/store/trip';
	import type { User } from '$lib/store/auth';

	export const load: Load = async ({ fetch, session }) => {
		try {
			let user: User | undefined = session.user;
			let metadata: Metadata = session.metadata;
			let trips: Trip[] = [];
			const queryString = objectToQueryString({ state: ENUM_TRIP_STATE.new_enquiry });
			const res = await fetch(`/trip.json?${queryString}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			if (res.ok) {
				const data = await res.json();
				trips = data || [];
			} else {
				const error = await res.json();
				console.error(error);
			}
			const queryStringAdvisor = objectToQueryString({
				advisor: user.advisorMe.id,
				state: [
					ENUM_TRIP_STATE.completed,
					ENUM_TRIP_STATE.enquired,
					ENUM_TRIP_STATE.planning,
					ENUM_TRIP_STATE.progressing,
					ENUM_TRIP_STATE.rejected,
					ENUM_TRIP_STATE.confirmed,
					ENUM_TRIP_STATE.travelling,
					ENUM_TRIP_STATE.returned,
				]
			});
			const resAdvisor = await fetch(`/trip.json?${queryStringAdvisor}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			if (resAdvisor.ok) {
				const data = await resAdvisor.json();
				trips = trips.concat(data || []);
			} else {
				const error = await resAdvisor.json();
				console.error(error);
			}
			return {
				props: {
					user,
					trips: trips.reduce((acc: Trip[], item) => {
						if (acc.length > 0) {
							const index = acc.findIndex((accItem) => item.id === accItem.id);
							if (index < 0) {
								acc.push(item);
							}
						} else {
							acc.push(item);
						}
						return acc;
					}, [])
				}
			};
		} catch (error) {
			console.log('Fetch advisor data:' + error);
		}
		return { props: {} };
	};
</script>

<script lang="ts">
	import EnquiriesList from './components/EnquiriesList.svelte';
	import TravelersList from './components/TravelersList.svelte';
	import type { Traveller } from '$lib/store/traveller';
	import { objectToQueryString } from '$lib/helpers/utils';

	export let user: User;
	export let trips: Trip[] = [];
	let tripsPlanning: Trip[] = trips.reduce((acc: Trip[], item: Trip) => {
		if (item.state === 'planning') {
			acc.push(item);
		}
		return acc;
	}, []);
	let tripsActive: Trip[] = trips.reduce((acc: Trip[], item: Trip) => {
		if (item.state === 'progressing') {
			acc.push(item);
		}
		return acc;
	}, []);
	let tripsRegistered: Trip[] = trips.reduce((acc: Trip[], item: Trip) => {
		if (item.state === 'enquired') {
			acc.push(item);
		}
		return acc;
	}, []);
	let tripsPast: Trip[] = trips.reduce((acc: Trip[], item: Trip) => {
		if (item.state === 'completed') {
			acc.push(item);
		}
		return acc;
	}, []);
	let tripsNew: Trip[] = trips.reduce((acc: Trip[], item: Trip) => {
		if (item.state === 'new_enquiry') {
			acc.push(item);
		}
		return acc;
	}, []);
	let tripsReject: Trip[] = trips.reduce((acc: Trip[], item: Trip) => {
		if (item.state === 'rejected') {
			acc.push(item);
		}
		return acc;
	}, []);
	let tripsConfirmed: Trip[] = trips.reduce((acc: Trip[], item: Trip) => {
		if (item.state === 'confirmed') {
			acc.push(item);
		}
		return acc;
	}, []);
	let tripsTravelling: Trip[] = trips.reduce((acc: Trip[], item: Trip) => {
		if (item.state === 'travelling') {
			acc.push(item);
		}
		return acc;
	}, []);
	let tripsReturned: Trip[] = trips.reduce((acc: Trip[], item: Trip) => {
		if (item.state === 'returned') {
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

	const travelersSections = [
		{ id: '', text: 'Home', link: '/account' },
		{ id: 'new-enquiry', text: 'New Enquiry' },
		{ id: 'planning', text: 'Planning' },
		{ id: 'confirmed', text: 'Confirmed' },
		{ id: 'travelling', text: 'Travelling' },
		// { id: 'active', text: 'Active' },
		{ id: 'registered', text: 'Registered' },
		{ id: 'past', text: 'Past' },
		// { id: 'rejected', text: 'Rejected' },
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
<NavigationSection selectedItem={'New Enquiry'} items={travelersSections} class={navFixed} />

<div class="content">
	<div class="title-content">
		<h1>Travelers</h1>
		<DesktopNavigationSection items={travelersSections} className={'travelers-screen'} />
	</div>
	<div class="section" id="home"></div>
	<div class="section" id="new-enquiry">
		<Accordion title="New Enquiry" open={true} id="">
			{#if tripsNew}
				<EnquiriesList 
					let:noCTA
					let:typeTraveler 
					noCTA={true}
					typeTraveler={true} 
					trips={tripsNew} 
					/>
			{/if}
		</Accordion>
	</div>
	<div class="section" id="planning">
		<Accordion title="Planning" open={true} id="">
			<TravelersList bind:trips={tripsPlanning} />
		</Accordion>
	</div>
	<div class="section" id="confirmed">
		<Accordion title="Confirmed" open={true} id="">
			<TravelersList bind:trips={tripsConfirmed} />
		</Accordion>
	</div>
	<div class="section" id="travelling">
		<Accordion title="Travelling" open={true} id="">
			<TravelersList bind:trips={tripsTravelling} />
		</Accordion>
	</div>
	<div class="section" id="registered">
		<Accordion title="Registered" open={true} id="">
			<TravelersList bind:trips={tripsReturned} />
		</Accordion>
	</div>
	<div class="section" id="past">
		<Accordion title="Past" open={true} id="">
			<TravelersList bind:trips={tripsPast} />
		</Accordion>
	</div>
	<!-- <div class="section" id="active">
		<Accordion title="Active" id="">
			<TravelersList bind:trips={tripsActive} />
		</Accordion>
	</div>
	<div class="section" id="registered">
		<Accordion title="Registered" id="">
			<TravelersList bind:trips={tripsRegistered} />
		</Accordion>
	</div>
	<div class="section" id="past">
		<Accordion title="Past" id="">
			<TravelersList bind:trips={tripsPast} />
		</Accordion>
	</div>
	<div class="section" id="rejected">
		<Accordion title="Rejected" id="">
			<TravelersList bind:trips={tripsReject} />
		</Accordion>
	</div> -->

	<div id="fake-height" />
</div>
