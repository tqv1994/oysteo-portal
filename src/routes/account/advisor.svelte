<script lang="ts" context="module">
	import { Loading } from 'carbon-components-svelte';
	import 'carbon-components-svelte/css/all.css';
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

	import '$lib/utils/firebase';
	import type { Load } from '@sveltejs/kit';

	import { afterUpdate } from 'svelte';
	import {
		normalizeInputDatePicker,
		formatOutputDatePicker,
		validateMMDDYYYY
	} from '$lib/helpers/datetime';

	//types
	import type { User } from '$lib/store/user';
	import type { Advisor } from '$lib/store/advisor';
	import type { Agency } from '$lib/store/agency';
	import type { Experience } from '$lib/store/experience';
	import type { Country } from '$lib/store/country';
	import type { Destination } from '$lib/store/destination';
	import type { Language } from '$lib/store/language';
	import type { Address } from '$lib/store/address';
	import type {
		AffiliateAgencies,
		AffiliateBenefitPrograms,
		AffiliateNetwork
	} from '$lib/store/affiliate';
	import OverlayLoading from '$lib/components/form/loading.svelte';
	import type { Metadata } from '$lib/store/metadata';
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
	import DestinationImage from '$lib/components/section/destination/Image.svelte';
	import ExperienceSection from '$lib/components/section/Experience.svelte';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import AgencyLogo from '$lib/components/section/AgencyLogo.svelte';
	import AdvisorAvatar from '$lib/components/section/AdvisorAvatar.svelte';
	import type { ExperienceType } from '$lib/store/experienceType';

	export const load: Load = async ({ fetch, session }) => {
		try {
			let user: User | undefined = session.user;
			let metadata: Metadata = session.metadata;
			const res = await fetch(`/advisor.json`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const resAgency = await fetch(`/agency.json`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (res.ok && resAgency.ok) {
				const data = await res.json();
				const dataAgency = await resAgency.json();
				let advisor = data.me.advisorMe;
				let agency = dataAgency.me.agencyMe;
				
				return {
					props: {
						user: user,
						advisor: advisor,
						agency: agency,
						countries: metadata.countries,
						languages: metadata.languages,
						address: advisor !== null ? advisor.address : [],
						experiences: advisor !== null ? advisor.experiences : [],
						experienceTypes1: advisor?.experienceTypes1,
						experienceTypes2: advisor?.experienceTypes2,
						experienceTypes3: advisor?.experienceTypes3,
						experienceTypes4: advisor?.experienceTypes4,
						experienceTypes5: advisor?.experienceTypes5,
						destinations: advisor !== null ? advisor.destinations : [],
						affiliateAgencies: advisor !== null ? advisor.affiliate_agencies : [],
						affiliateAgenciesAgency: agency !== null ? agency.affiliate_agencies : [],
						affiliateNetworks: advisor !== null ? advisor.affiliate_networks : [],
						affiliateNetworksAgency: agency !== null ? agency.affiliate_networks : [],
						affiliateBenefitPrograms: advisor !== null ? advisor.affiliate_benefit_programs : [],
						affiliateBenefitProgramsAgency: agency !== null ? agency.affiliate_benefit_programs : [],
						experienceList: metadata.experiences,
						experienceTypeList: metadata.experienceTypes,
						affiliateAgencyList: metadata.affiliateAgencies,
						affiliateNetworkList: metadata.affiliateNetworks,
						affiliateBenefitProgramList: metadata.affiliateBenefitPrograms
					}
				};
			} else {
				const error = await res.json();
				console.error(error);
			}
		} catch (error) {
			console.log('Fetch advisor data:' + error);
		}
		return { props: {} };
	};
	
</script>

<script lang="ts">
	export let user: User;
	export let advisor: Advisor;
	export let agency: Agency;
	export let experiences: Experience[];
	export let countries: Country[];
	export let languages: Language[];
	export let destinations: Destination[];
	export let address: Address[];
	export let affiliateAgenciesAgency: AffiliateAgencies[];
	export let affiliateNetworksAgency: AffiliateNetwork[];
	export let affiliateBenefitProgramsAgency: AffiliateBenefitPrograms[];
	export let experienceTypes1: ExperienceType;
	export let experienceTypes2: ExperienceType;
	export let experienceTypes3: ExperienceType;
	export let experienceTypes4: ExperienceType;
	export let experienceTypes5: ExperienceType;

	export let affiliateAgencyList: AffiliateAgencies[];
	export let affiliateNetworkList: AffiliateNetwork[];
	export let affiliateBenefitProgramList: AffiliateBenefitPrograms[];
	export let experienceTypeList: ExperienceType[];

	let activeSection = '';
	let loadingLabel = 'Saving ...';
	let y, prevY;
	let navFixed = '';
	let activeLoading = false;
	const type = 'advisor';
	const type2 = 'agency';

	const setEditing = (sectionName: string) => () => {
		activeSection = sectionName;
	};

	const advisorSections = [
		{ id: 'id-and-password', text: 'ID and Password' },
		{ id: 'contacts', text: 'Contacts' },
		{ id: 'aboutme', text: 'About me' },
		{ id: 'profile', text: 'Profile' },
		{ id: 'destinations', text: 'Destinations' },
		{ id: 'specialities', text: 'Specialities' },
		{ id: 'affiliations', text: 'Affiliations' }
	];

	let invalidDateVisited = {
		status: false,
		message: 'Invalid date'
	};
	const updateDestination = async (e: CustomEvent) => {
		const index = e.detail.index;
		const field = e.detail.field;
		try {
			const obj = destinations[index];
			let data = {
				name: obj.name || '',
				location: obj.location || '',
				description: obj.description || '',
				date_visited: obj.date_visited || null
			};

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
			activeLoading = true;

			const res = await fetch(`/destination/update-${obj.id}.json`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...data })
			});
			
			if (res.ok) {
				setEditing('');
			}
		} catch (error) {}
		activeLoading = false;
	};
	afterUpdate(() => {
		navFixed = prevY > y ? 'nav-fixed' : '';
		prevY = y;
	});
	
</script>

<svelte:window bind:scrollY={y} />
<OverlayLoading bind:activeLoading bind:label={loadingLabel} />
<NavigationSection items={advisorSections} class={navFixed} />

<div class="content">
	<div class="title-content">
		<h1>Profile</h1>
		<DesktopNavigationSection items={advisorSections} className={'advisor-screen'} />
	</div>
	{#if user}
		<FormSection title="ID and Password" icon={Password20} id="id-and-password">
			<IdAndPassword {user} bind:activeSection bind:activeLoading />
		</FormSection>
	{/if}

	<FormSection title="Contacts" icon={Identification20} id="contacts">
		<Contact bind:activeSection bind:activeLoading object={advisor} {type} />
		<PhoneNumber
			{countries}
			bind:activeSection
			bind:activeLoading
			object={advisor}
			type={'advisor'}
		/>
	</FormSection>

	<FormSection title="About me" icon={User20} id="aboutme">
		<!-- address -->
		<AddressGroup
			bind:activeSection
			bind:activeLoading
			{address}
			{type}
			{countries}
			userId={user.id}
			objectId={advisor.id}
		/>
		<AboutMe bind:activeSection bind:activeLoading {advisor} {languages} {type} />
	</FormSection>

	<FormSection title="Profile" icon={UserAvatar20} id="profile">
		<AdvisorAvatar bind:activeSection bind:loadingLabel bind:activeLoading {advisor} />
		<Profile bind:activeSection bind:activeLoading {advisor} {type} />
	</FormSection>

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
			bind:activeLoading
			advisorId={advisor.id}
			bind:destinations
			bind:loadingLabel
		/>

		{#each destinations as destination, index}
			<DestinationName bind:activeSection bind:destinations {index} on:submit={updateDestination} />

			<DestinationInsight
				bind:activeSection
				bind:destinations
				{index}
				on:submit={updateDestination}
			/>
			<DestinationLocation
				bind:activeSection
				bind:destinations
				{index}
				on:submit={updateDestination}
			/>

			<DestinationImage
				bind:activeSection
				bind:loadingLabel
				bind:activeLoading
				bind:destinations
				{index}
			/>

			<DestinationDateVisited
				bind:activeSection
				bind:destinations
				bind:invalidDateVisited
				{index}
				on:submit={updateDestination}
			/>
		{/each}
	</FormSection>

	<FormSection title="Specialities" icon={UserCertification20} id="specialities">
		<ExperienceSection
			bind:activeSection
			bind:activeLoading
			advisorId={advisor.id}
			{type}
			{experienceTypes1}
			{experienceTypes2}
			{experienceTypes3}
			{experienceTypes4}
			{experienceTypes5}
			{experienceTypeList}
		/>
	</FormSection>

	<FormSection title="Affiliations" icon={Star20} id="affiliations">
		{#if agency}
			<Affiliation
				bind:activeSection
				bind:activeLoading
				objectId={agency.id}
				type = {type2}
				label="Agency"
				name="Agencies"
				affiliate={affiliateAgenciesAgency}
				list={affiliateAgencyList}
			/>
			<Affiliation
				bind:activeSection
				bind:activeLoading
				objectId={agency.id}
				type = {type2}
				label="Networks"
				name="Networks"
				affiliate={affiliateNetworksAgency}
				list={affiliateNetworkList}
			/>
			<Affiliation
				bind:activeSection
				bind:activeLoading
				objectId={agency.id}
				type = {type2}
				label="Benefit Programs"
				name="Benefit Programs"
				affiliate={affiliateBenefitProgramsAgency}
				list={affiliateBenefitProgramList}
			/>
		{:else}
			<Affiliation
			bind:activeSection
			bind:activeLoading
			objectId={advisor.agency.id}
			type = {type2}
			label="Agency"
			name="Agencies"
			affiliate={affiliateAgenciesAgency}
			list={affiliateAgencyList}
			/>
			<Affiliation
				bind:activeSection
				bind:activeLoading
				objectId={advisor.agency.id}
				type = {type2}
				label="Networks"
				name="Networks"
				affiliate={affiliateNetworksAgency}
				list={affiliateNetworkList}
			/>
			<Affiliation
				bind:activeSection
				bind:activeLoading
				objectId={advisor.agency.id}
				type = {type2}
				label="Benefit Programs"
				name="Benefit Programs"
				affiliate={affiliateBenefitProgramsAgency}
				list={affiliateBenefitProgramList}
			/>
		{/if}
	</FormSection>
	<div id="fake-height" />
</div>
