<script lang="ts" context="module">
	import {
		Identification20,
		Location20,
		Star20,
		Password20,
		User20,
		UserAvatar20,
		UserCertification20
	} from 'carbon-icons-svelte';
	import FormSection from '$lib/components/form/section.svelte';
	import DesktopNavigationSection from '$lib/components/navigation/desktop_nav_section.svelte';
	import NavigationSection from '$lib/components/navigation/modal.svelte';
	import { afterUpdate, onMount } from 'svelte';
	import {
		normalizeInputDatePicker,
		formatOutputDatePicker,
		validateMMDDYYYY
	} from '$lib/helpers/datetime';
	import {
		affiliateAgencyStore,
		affiliateBenefitProgramStore,
		affiliateNetworkStore
	} from '$lib/store/affiliate';
	import OverlayLoading from '$lib/components/form/loading.svelte';
	import IdAndPassword from '$lib/components/section/IdAndPassword.svelte';
	import PhoneNumber from '$lib/components/section/PhoneNumber.svelte';
	import Contact from '$lib/components/section/Contact.svelte';

	import AddressGroup from '$lib/components/section/AddressGroup.svelte';
	import AboutMe from '$lib/components/section/AboutMe.svelte';
	import Profile from '$lib/components/section/Profile.svelte';
	import Affiliation from '$lib/components/section/Affiliation.svelte';
	import CreateDestination from '$lib/components/section/CreateDestination.svelte';
	import DestinationName from '$lib/components/section/destination/Name.svelte';
	import DestinationInsight from '$lib/components/section/destination/Insight.svelte';
	import DestinationLocation from '$lib/components/section/destination/Location.svelte';
	import DestinationDateVisited from '$lib/components/section/destination/DateVisited.svelte';
	import ExperienceSection from '$lib/components/section/Experience.svelte';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import AdvisorAvatar from '$lib/components/section/AdvisorAvatar.svelte';
	import { destinationTypeStore } from '$lib/store/destinationType';
	import { onAfterOpenForm } from '$lib/helpers/scripts';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import { authStore } from '$lib/store/auth';
	import type { Load } from '@sveltejs/kit';
	import { notify } from '$lib/components/Toast.svelte';
	import { InlineLoading } from 'carbon-components-svelte';
	import { isFormSavingStore } from '$lib/store/isFormSaving';

	export const load: Load = async ({ url, params }) => {
		const { user } = get(authStore);
		if (user.agencyMe && !user.agencyMe.legalName) {
			const redirect = '/account/agency#business-infomation';
			if (browser) {
				notify({
					kind: 'error',
					timeout: 3000,
					title: 'Business information',
					subtitle:
						'Your business information is incomplete, please supply all the required information'
				});
				goto(redirect);
			} else {
				return {
					status: 302,
					redirect
				};
			}
		}

		const email = url.searchParams.get('email');

		return {
			props: {
				email
			}
		};
	};
</script>

<script lang="ts">
	let activeSection = '';
	let y, prevY: number;
	let navFixed = '';
	const type = 'advisor';
	const type2 = 'agency';
	let indexDestinationUpdated: number | undefined;

	const setEditing = (sectionName: string) => () => {
		activeSection = sectionName;
		onAfterOpenForm();
	};

	let advisorSections = [
		{ id: 'id-and-password', text: 'ID and Password' },
		{ id: 'contacts', text: 'Contacts' },
		{ id: 'aboutme', text: 'About me' },
		{ id: 'profile', text: 'Profile' },
		{ id: 'destinations', text: 'Destinations' },
		{ id: 'specialities', text: 'Specialities' }
	];

	if ($authStore.user.agencyMe) {
		advisorSections.push({ id: 'affiliations', text: 'Affiliations' });
	}

	let invalidDateVisited = {
		status: false,
		message: 'Invalid date'
	};
	const updateDestination = async (e: CustomEvent) => {
		const index = e.detail.index;
		const field = e.detail.field;
		indexDestinationUpdated = index;
		try {
			const obj = $authStore.user.advisorMe.destinations[index];
			let data = {
				name: obj.name || '',
				location: obj.location || '',
				description: obj.description || '',
				date_visited: obj.date_visited || null,
				visible: obj.visible || false,
				country: obj.country.id || null
			};
			if (field == 'visible') {
				data.visible = data.visible;
			}
			if (field == 'date_visited') {
				data.date_visited = formatOutputDatePicker(data.date_visited);
				if (!validateMMDDYYYY(data.date_visited)) {
					invalidDateVisited.status = true;
					setTimeout(() => {
						invalidDateVisited.status = false;
					}, INVALID_DELAY_TIME);
					return;
				}
				data.date_visited = normalizeInputDatePicker(data.date_visited);
			}
			isFormSavingStore.set({ saving: true });

			const res = await fetch(`/destination/update-${obj.id}.json`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...data })
			});

			if (res.ok) {
				// TODO: What's this?
				// destinations[index].country = countries.find((item) => item.id == data.country);
				setEditing('');
			}
		} catch (error) {}
		isFormSavingStore.set({ saving: false });
		indexDestinationUpdated = undefined;
	};
	afterUpdate(() => {
		navFixed = prevY > y ? 'nav-fixed' : '';
		prevY = y;
	});

	const destTypeOther = Object.values($destinationTypeStore.items).find((t) => t.name === 'Other');
</script>

<svelte:window bind:scrollY={y} />
<NavigationSection items={advisorSections} class={navFixed} />
<div class="content">
	<div class="title-content">
		<p class="tab-mobile">Advisor</p>
		<h1>Profile</h1>
		<DesktopNavigationSection items={advisorSections} className={'advisor-screen'} />
	</div>
	{#if $authStore.user}
		<FormSection title="ID and Password" icon={Password20} id="id-and-password">
			<IdAndPassword user={$authStore.user} bind:activeSection />
		</FormSection>
	{/if}

	<FormSection title="Contacts" icon={Identification20} id="contacts">
		<Contact bind:activeSection object={$authStore.user.advisorMe} {type} />
		<PhoneNumber bind:activeSection object={$authStore.user.advisorMe} type={'advisor'} />
	</FormSection>

	<FormSection title="About me" icon={User20} id="aboutme">
		<!-- address -->
		<AddressGroup
			bind:activeSection
			address={$authStore.user.advisorMe.address}
			{type}
			userId={$authStore.user.id}
			objectId={$authStore.user.advisorMe?.id}
		/>
		<AboutMe bind:activeSection advisor={$authStore.user.advisorMe} {type} />
	</FormSection>

	<FormSection title="Profile" icon={UserAvatar20} id="profile">
		<AdvisorAvatar bind:activeSection advisor={$authStore.user.advisorMe} />
		<Profile bind:activeSection advisor={$authStore.user.advisorMe} {type} />
	</FormSection>
	{#if $authStore.user.advisorMe?.destinations}
		<FormSection
			title="Destinations"
			icon={Location20}
			rightIcon
			titleRightIcon={'Add Destination'}
			id="destinations"
			on:add={setEditing('destination-add')}
		>
			<CreateDestination
				bind:activeSection
				type1={destTypeOther?.id}
				advisorId={$authStore.user.advisorMe.id}
				userId={$authStore.user.id}
				bind:destinations={$authStore.user.advisorMe.destinations}
			/>

			{#each $authStore.user.advisorMe.destinations || [] as destination, index}
				<DestinationName
					bind:activeSection
					bind:destinations={$authStore.user.advisorMe.destinations}
					{index}
					on:submit={updateDestination}
				/>

				<DestinationInsight
					bind:activeSection
					bind:destinations={$authStore.user.advisorMe.destinations}
					{index}
					on:submit={updateDestination}
				/>
				<DestinationLocation
					bind:activeSection
					bind:destinations={$authStore.user.advisorMe.destinations}
					{index}
					on:submit={updateDestination}
				/>

				<!-- <DestinationImage
				bind:activeSection
				bind:loadingLabel
				bind:activeLoading
				bind:destinations
				{index}
			/> -->

				<DestinationDateVisited
					bind:activeSection
					bind:destinations={$authStore.user.advisorMe.destinations}
					{index}
					on:submit={updateDestination}
				/>
				{#if $isFormSavingStore.saving && indexDestinationUpdated === index}
					<div class="saving-modal" />
					<InlineLoading status="active" description="Saving..." />
				{/if}
			{/each}
		</FormSection>
	{/if}
	<FormSection title="Specialities" icon={UserCertification20} id="specialities">
		<ExperienceSection
			bind:activeSection
			advisorId={$authStore.user.advisorMe.id}
			{type}
			experienceTypes1={$authStore.user.advisorMe.experienceTypes1}
			experienceTypes2={$authStore.user.advisorMe.experienceTypes2}
			experienceTypes3={$authStore.user.advisorMe.experienceTypes3}
			experienceTypes4={$authStore.user.advisorMe.experienceTypes4}
			experienceTypes5={$authStore.user.advisorMe.experienceTypes5}
		/>
	</FormSection>
	{#if $authStore.user.agencyMe}
		<FormSection title="Affiliations" icon={Star20} id="affiliations">
			<Affiliation
				bind:activeSection
				objectId={$authStore.user.agencyMe.id}
				type={type2}
				label="Agency"
				name="Agencies"
				affiliate={$authStore.user.agencyMe.affiliate_agencies}
				list={Object.values($affiliateAgencyStore.items)}
			/>
			<Affiliation
				bind:activeSection
				objectId={$authStore.user.agencyMe.id}
				type={type2}
				label="Networks"
				name="Networks"
				affiliate={$authStore.user.agencyMe.affiliate_networks}
				list={Object.values($affiliateNetworkStore.items)}
			/>
			<Affiliation
				bind:activeSection
				objectId={$authStore.user.agencyMe.id}
				type={type2}
				label="Benefit Programs"
				name="Benefit Programs"
				affiliate={$authStore.user.agencyMe.affiliate_benefit_programs}
				list={Object.values($affiliateBenefitProgramStore.items)}
			/>
			<!-- <Affiliation
				bind:activeSection
				objectId={$authStore.user.advisorMe.id}
				type={type2}
				label="Agency"
				name="Agencies"
				affiliate={$authStore.user.agencyMe.affiliate_agencies}
				list={Object.values($affiliateAgencyStore.items)}
			/>
			<Affiliation
				bind:activeSection
				objectId={$authStore.user.advisorMe.id}
				type={type2}
				label="Networks"
				name="Networks"
				affiliate={$authStore.user.agencyMe.affiliate_networks}
				list={Object.values($affiliateNetworkStore.items)}
			/>
			<Affiliation
				bind:activeSection
				objectId={$authStore.user.advisorMe.id}
				type={type2}
				label="Benefit Programs"
				name="Benefit Programs"
				affiliate={$authStore.user.agencyMe.affiliate_benefit_programs}
				list={Object.values($affiliateBenefitProgramStore.items)}
			/> -->
		</FormSection>
	{/if}
	<div id="fake-height" />
</div>
