<script lang="ts" context="module">
	import DesktopNavigationSection from '$lib/components/navigation/desktop_nav_section.svelte';
	import NavigationSection from '$lib/components/navigation/modal.svelte';
	import type { Load } from '@sveltejs/kit';
	import { afterUpdate } from 'svelte';
	import OverlayLoading from '$lib/components/form/loading.svelte';
	import Accordion from '$lib/components/Accordion.svelte';
	import { type Trip, TripState, tripStore } from '$lib/store/trip';
	import FormSection from '$lib/components/form/section.svelte';

	export const load: Load = async ({ params: { id } }) => {
		const countries = await getCollection<Country>(fetch, 'country');

		let trip: Trip;
		let travellers: Traveller[];

		if (id === 'new') {
			return {
				state: TripState.enquired
			};
		}
		trip = get(tripStore).find((t) => t.id === id);
		if (!trip) {
			try {
				const res = await pget(fetch, `trips/${id}`);
				if (res.ok) {
					trip = await res.json();
				}
			} catch (err) {
				console.error('Error fetch trip', id, err);
			}
		}

		return { props: { countries, trip } };
	};
</script>

<script lang="ts">
	import Status from './trip-detail/components/Status.svelte';
	import TripPlanWhen from './trip-detail/components/TripPlanWhen.svelte';
	import TripPlanWho from './trip-detail/components/TripPlanWho.svelte';
	import TripPlanWhere from './trip-detail/components/TripPlanWhere.svelte';
	import Details from './trip-detail/components/Details.svelte';
	import Documents from './trip-detail/components/Documents.svelte';
	import EmergencyList from './trip-detail/components/EmergencyList.svelte';
	import EmergencyInfo from './trip-detail/components/EmergencyInfo.svelte';
	import { ENUM_DOCUMENT_TYPE, type Document } from '$lib/store/document';
	import type { Traveller } from '$lib/store/traveller';
	import AdditionalInfo from './trip-detail/components/AdditionalInfo.svelte';
	import type { Country } from '$lib/store/country';
	import { get } from 'svelte/store';
	import { getCollection } from '$lib/store/collection';
	import { pget } from '$lib/utils/fetch';
	import FormPage from '$lib/components/form/FormPage.svelte';
	import type CreateTraveller from '$lib/components/section/trip-traveller/CreateTraveller.svelte';

	export let countries: Country[];
	export let trip: Trip;

	let loadingLabel = 'Saving ...';
	let y, prevY;
	let navFixed = '';
	let activeLoading = false;
	let addContactFormOpen = false;

	afterUpdate(() => {
		navFixed = prevY > y ? 'nav-fixed' : '';
		prevY = y;
	});
</script>

{#if trip}
	<FormPage title="Trip Detail">
		<div class="section" id="status">
			<Accordion title="Status" open={true} id="">
				<Status bind:trip />
			</Accordion>
		</div>

		<FormSection title="Trip Plan" id="trip-plan">
			<TripPlanWho bind:trip traveller={trip?.travellers[0]} />
			<TripPlanWhen bind:trip />
			<TripPlanWhere {countries} bind:trip />
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
			actionLabel={trip ? 'Add Contact' : undefined}
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
	</FormPage>
{:else}
	<p class="note-not-found">Loading...</p>
{/if}
