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
	import type { Trip } from '$lib/store/trip';
	import type { User } from '$lib/store/auth';

	export const load: Load = async ({ fetch, session, page }) => {
		try {
			let user: User | undefined = session.user;
			let metadata: Metadata = session.metadata;
			const res = await fetch(`/trip.json`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (res.ok) {
				const data = await res.json();
				let trips: Trip[] = data;
				return {
					props: {
						user: user,
						trips
					}
				};
			} else {
				const error = await res.json();
				console.error(error);
			}
		} catch (error) {
			console.log('Fetch advisor data:' + error);
		}
        return { props:{}}
	};
</script>

<script lang="ts">
import TravelersList from "./components/TravelersList.svelte";


	export let user: User;
	export let trips: Trip[] = [];
    let tripsPlanning: Trip[] = trips.reduce((acc: Trip[], item: Trip)=>{
        if(item.state === 'planning'){
            acc.push(item);
        }
        return acc;
    },[]);
    let tripsActive: Trip[] = trips.reduce((acc: Trip[], item: Trip)=>{
        if(item.state === 'progressing'){
            acc.push(item);
        }
        return acc;
    },[]);
	let tripsRegistered: Trip[] = trips.reduce((acc: Trip[], item: Trip)=>{
        if(item.state === 'enquired'){
            acc.push(item);
        }
        return acc;
    },[]);
    let tripsPast: Trip[] = trips.reduce((acc: Trip[], item: Trip)=>{
        if(item.state === 'completed'){
            acc.push(item);
        }
        return acc;
    },[]);

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
		{ id: 'active', text: 'Active' },
        { id: 'registered', text: 'Registered' },
        { id: 'past', text: 'Past' }
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
<NavigationSection items={travelersSections} class={navFixed} />

<div class="content">
	<div class="title-content">
		<h1>Travelers</h1>
		<DesktopNavigationSection items={travelersSections} className={'travelers-screen'} />
	</div>
	<div class="section" id="new-enquiry">
		<Accordion title="New Enquiry" open={true} id="">
			
		</Accordion>
	</div>
	<div class="section" id="planning">
		<Accordion title="Planning" open={true} id="">
			<TravelersList bind:trips={tripsPlanning} />
		</Accordion>
	</div>
	<div class="section" id="active">
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
    
	<div id="fake-height" />
</div>
