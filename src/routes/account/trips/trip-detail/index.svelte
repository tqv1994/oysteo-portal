<script lang="ts" context="module">
	import DesktopNavigationSection from '$lib/components/navigation/desktop_nav_section.svelte';
	import NavigationSection from '$lib/components/navigation/modal.svelte';
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
			let metadata: Metadata | undefined = session.metadata;
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
							countries: metadata.countries,
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
						countries: metadata.countries,
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
	import EmergencyList from './components/EmergencyList.svelte';
	import EmergencyInfo from './components/EmergencyInfo.svelte';
	import { ENUM_DOCUMENT_TYPE } from '$lib/store/document';
	import type { Traveller } from '$lib/store/traveller';
	import AdditionalInfo from './components/AdditionalInfo.svelte';
	import type { Country } from '$lib/store/country';
	export let countries: Country[] = [];

	export let user: User;
	export let trip: Trip | undefined;
	export let travellers: Traveller[] = [];
	let loadingLabel = 'Saving ...';
	let y, prevY;
	let navFixed = '';
	let activeLoading = false;
	let activeSection = '';
	let addContactFormOpen = false;

	const tripSections = [
		{ id: '', text: 'Home', link: '/account' },
		{ id: 'status', text: 'Status' },
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
<NavigationSection selectedItem={'Status'} items={tripSections} class={navFixed} />

<div class="content">
	<div class="title-content">
		<h1>{trip ? 'Trip Detail' : 'New Trip'}</h1>
		<DesktopNavigationSection items={tripSections} className={'trip-screen'} />
	</div>
	<div class="section" id="home" />
	<div class="section" id="status">
		<Accordion title="Status" open={true} id="">
			<Status bind:trip />
		</Accordion>
	</div>
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
	<FormSection title="Documents" id="documents">
		{#if trip}
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
		{/if}
	</FormSection>

	<FormSection
		title="Emergency"
		id="emergency"
		titleRightIcon={'Add Contact'}
		rightIcon={trip ? true : false}
		on:add={() => {
			addContactFormOpen = true;
		}}
	>
		<EmergencyList {countries} bind:trip bind:addContactFormOpen />
		<EmergencyInfo bind:trip />
	</FormSection>
	<FormSection title="Additional Info" id="additional-info">
		<AdditionalInfo bind:trip />
	</FormSection>
	<div id="fake-height" />
</div>

<style lang="scss">
</style>
