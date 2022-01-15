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
	import FormSection from '$lib/components/form/section.svelte';

	export const load: Load = async ({ fetch, session, url }) => {
		try {
			let user: User | undefined = session.user;
			let trip: Trip | undefined;
			let travellers: Traveller[] = [];
			const id = url.searchParams.get('id');
			const res = await fetch('/traveller.json', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			if (res.ok) {
				travellers = await res.json();
			}

			if (id) {
				const res = await fetch(`/trip/${id}.json`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				});
				if (res.ok) {
					trip = await res.json();
					return {
						props: {
							user: user,
							trip,
							travellers
						}
					};
				} else {
					const error = await res.json();
					console.error(error);
				}
			} else {
				return {
					props: {
						user: user,
						trip,
						travellers
					}
				};
			}
		} catch (error) {
			console.log('Fetch advisor data:' + error);
		}
		return { props: {} };
	};
</script>

<script lang="ts">
	import Status from './components/Status.svelte';
	import TripPlanWhen from './components/TripPlanWhen.svelte';
	import TripPlanWho from './components/TripPlanWho.svelte';
	import TripPlanWhere from './components/TripPlanWhere.svelte';
	import Details from './components/Details.svelte';
	import Documents from './components/Documents.svelte';
	import { ENUM_IDENTIFICATION_TYPE } from '$lib/store/identification';
	import EmergencyList from './components/EmergencyList.svelte';
	import EmergencyInfo from './components/EmergencyInfo.svelte';
	import AddtionalInfo from './components/AddtionalInfo.svelte';
	import { ENUM_DOCUMENT_TYPE } from '$lib/store/document';
	import type { Traveller } from '$lib/store/traveller';

	export let user: User;
	export let trip: Trip | undefined;
	export let travellers: Traveller[] = [];
	let loadingLabel = 'Saving ...';
	let y, prevY;
	let navFixed = '';
	let activeLoading = false;
	let activeSection = '';
	let addContactFormOpen: boolean = false;

	const tripSections = [
		{ id: '', text: 'Home', link: '/account' },
		{ id: 'trip-plan', text: 'Trip Plan' },
		{ id: 'details', text: 'Details' },
		{ id: 'documents', text: 'Documents' },
		{ id: 'emergency', text: 'Emergency' },
		{ id: 'additional-info', text: 'Additional Info' }
	];

	afterUpdate(() => {
		navFixed = prevY > y ? 'nav-fixed' : '';
		prevY = y;
	});

	const setEditing = (sectionName: string) => () => {
		activeSection = sectionName;
	};
</script>

<svelte:window bind:scrollY={y} />
<OverlayLoading bind:activeLoading bind:label={loadingLabel} />
<NavigationSection items={tripSections} class={navFixed} />

<div class="content">
	<div class="title-content">
		<h1>{trip ? 'Trip Detail' : 'New Trip'}</h1>
		<DesktopNavigationSection items={tripSections} className={'trip-screen'} />
	</div>
	<Accordion title="Status" open={true} id="">
		<Status bind:trip />
	</Accordion>
	<FormSection title="Trip Plan" id="trip-plan">
		<TripPlanWho bind:trip bind:travellers />
		<TripPlanWhen bind:trip />
		{#if trip}
			<TripPlanWhere bind:trip />
		{/if}
	</FormSection>
	<FormSection title="Details" id="details">
		<Details bind:trip />
	</FormSection>
	{#if trip}
		<FormSection title="Documents" id="documents">
			<Documents bind:trip type={ENUM_DOCUMENT_TYPE.excursion} />
			<Documents bind:trip type={ENUM_DOCUMENT_TYPE.ground_partner} />
			<Documents bind:trip type={ENUM_DOCUMENT_TYPE.invoice} />
			<Documents bind:trip type={ENUM_DOCUMENT_TYPE.itinerary} />
			<Documents bind:trip type={ENUM_DOCUMENT_TYPE.passport} />
			<Documents bind:trip type={ENUM_DOCUMENT_TYPE.ticket} />
			<Documents bind:trip type={ENUM_DOCUMENT_TYPE.transit} />
			<Documents bind:trip type={ENUM_DOCUMENT_TYPE.visa} />
			<Documents bind:trip type={ENUM_DOCUMENT_TYPE.voucher} />
			<Documents bind:trip type={ENUM_DOCUMENT_TYPE.other} />
		</FormSection>
	{/if}
	<FormSection
		title="Emergency"
		id="emergency"
		titleRightIcon={'Add Contact'}
		rightIcon
		on:add={() => {
			addContactFormOpen = true;
		}}
	>
		<EmergencyInfo bind:trip />
		<EmergencyList bind:trip bind:addContactFormOpen />
	</FormSection>
	<FormSection title="Addtional Info" id="additional-info">
		<AddtionalInfo bind:trip />
	</FormSection>
	<div id="fake-height" />
</div>

<style lang="scss">
</style>
