<script lang="ts" context="module">
	import {
		Identification as IdentificationIcon,
		Location as LocationIcon,
		Star as StarIcon,
		Password as PasswordIcon,
		User as UserIcon,
		UserAvatar as UserAvatarIcon,
		UserCertification as UserCertificationIcon
	} from 'carbon-icons-svelte';
	import FormSection from '$lib/components/form/section.svelte';
	import { tick } from 'svelte';
	import IdAndPassword from '$lib/components/section/IdAndPassword.svelte';
	import PhoneNumber from '$lib/components/section/PhoneNumber.svelte';
	import Contact from '$lib/components/section/Contact.svelte';
	import AddressGroup from '$lib/components/section/AddressGroup.svelte';
	import AboutMe from '$lib/components/section/AboutMe.svelte';
	import Profile from '$lib/components/section/Profile.svelte';
	import Affiliation from '$lib/components/section/Affiliation.svelte';
	import CreateDestination from '$lib/components/section/CreateDestination.svelte';
	import DestinationCountry from '$lib/components/section/destination/Country.svelte';
	import DestinationInsight from '$lib/components/section/destination/Insight.svelte';
	import DestinationLocation from '$lib/components/section/destination/Location.svelte';
	import DestinationDateVisited from '$lib/components/section/destination/DateVisited.svelte';
	import ExperienceSection from '$lib/components/section/Experience.svelte';
	import AdvisorAvatar from '$lib/components/section/AdvisorAvatar.svelte';
	import { destinationTypeStore } from '$lib/store/destinationType';
	import { onAfterOpenForm } from '$lib/helpers/scripts';
	import type { User } from '$lib/store/auth';
	import type { Advisor } from '$lib/store/advisor';
	import { getCollection } from '$lib/store/collection';
	import type { Agency } from '$lib/store/agency';
	import type { Kind } from '$lib/store/category';
	import type { Load } from '@sveltejs/kit';
	import { session } from '$app/stores';
	import Destination from '$lib/components/section/Destination.svelte';
	import FormPage from '$lib/components/form/FormPage.svelte';
	import { notify } from '$lib/components/Toast.svelte';
	import { beforeNavigate } from '$app/navigation';
	import type { Country } from '$lib/store/country';

	export const load: Load = async ({ fetch }) => {
		let affiliateAgencies = await getCollection(fetch, 'affiliate-agency');
		let affiliateBenefitPrograms = await getCollection(fetch, 'affiliate-benefit-program');
		let affiliateNetworks = await getCollection(fetch, 'affiliate-network');
		let countries = await getCollection(fetch, 'country');
		let experienceType = await getCollection(fetch, 'experience-type');
		let languages = await getCollection(fetch, 'language');
		let destinations = await getCollection(fetch, 'destination');

		return {
			props: {
				affiliateAgencies,
				affiliateBenefitPrograms,
				affiliateNetworks,
				countries,
				experienceType,
				languages,
				destinations
			}
		};
	};
</script>

<script lang="ts">
	export let affiliateAgencies: Kind[];
	export let affiliateBenefitPrograms: Kind[];
	export let affiliateNetworks: Kind[];
	export let countries: Country[];
	export let experienceType: Kind[];
	export let languages: Kind[];
	export let destinations: Kind[];

	let contactForm: FormSection;
	let activeSection = '';
	let user: User;
	let advisorMe: Advisor;
	let agencyMe: Agency;

	session.subscribe((s) => {
		user = s.user;
		advisorMe = s.advisorMe;
		agencyMe = s.agencyMe;
	});

	function setEditing(sectionName: string) {
		return async () => {
			activeSection = sectionName;
			await tick();
			onAfterOpenForm();
		};
	}

	function handleChange(event: CustomEvent<Advisor>) {
		session.update((s) => {
			s.advisorMe = {
				...event.detail,
				agency: !agencyMe && event.detail.agency ? s.advisorMe.agency : event.detail.agency
			};
			return s;
		});
	}

	beforeNavigate(({ cancel, to }) => {
		if (!to.pathname.startsWith('/auth') && !advisorMe.name) {
			notify({
				title: 'Your name',
				subtitle: 'Your name is required.'
			});
			contactForm.scrollIntoView();
			cancel();
		}
	});

	// const destTypeOther = $destinationTypeStore.find((t) => t.name === 'Other');
</script>

<FormPage title="Profile">
	{#if user}
		<FormSection title="ID and Password" icon={PasswordIcon} id="id-and-password">
			<IdAndPassword {user} bind:activeSection />
		</FormSection>
	{/if}

	<FormSection bind:this={contactForm} title="Contacts" icon={IdentificationIcon} id="contacts">
		<Contact
			bind:activeSection
			name={advisorMe.name}
			email={advisorMe.email}
			target="advisors/me"
			type="advisor"
			on:change={handleChange}
		/>
		<PhoneNumber
			bind:activeSection
			phone_number={advisorMe.phone_number}
			cell_mobile={advisorMe.cell_mobile}
			whatsapp={advisorMe.whatsapp}
			emergency={advisorMe.emergency}
			phone_number_code={advisorMe.phone_number_code}
			cell_mobile_code={advisorMe.cell_mobile_code}
			whatsapp_code={advisorMe.whatsapp_code}
			emergency_code={advisorMe.emergency_code}
			{countries}
			target="advisors/me"
			on:change={handleChange}
		/>
	</FormSection>

	<FormSection title="About me" icon={UserIcon} id="aboutme">
		<!-- address -->
		<AddressGroup
			bind:activeSection
			address={advisorMe.address}
			{countries}
			target="advisors/me"
			on:change={handleChange}
		/>
		<AboutMe
			bind:activeSection
			advisor={advisorMe}
			{languages}
			target="advisors/me"
			on:change={handleChange}
		/>
	</FormSection>

	<FormSection title="Profile" icon={UserAvatarIcon} id="profile">
		<AdvisorAvatar bind:activeSection advisor={advisorMe} />
		<Profile bind:activeSection advisor={advisorMe} target="advisors/me" on:change={handleChange} />
	</FormSection>
	<FormSection title="Destinations" icon={LocationIcon} id="destinations">
		<Destination
			bind:activeSection
			label="Destination"
			name="Destinations"
			destination={advisorMe.destinations}
			list={destinations}
		/>
		<!-- {#if advisorMe.destinations}
			<CreateDestination
				bind:activeSection
				type1={destTypeOther?.id}
				advisorId={advisorMe.id}
				userId={user.id}
				bind:destinations={advisorMe.destinations}
			/>
			{#each advisorMe.destinations || [] as destination, index}
				<DestinationCountry {countries} bind:activeSection {destination} />
				<DestinationInsight bind:activeSection {destination} />
				<DestinationLocation bind:activeSection {destination} /> 
				<DestinationDateVisited bind:activeSection {destination} />-->

		<!-- <DestinationImage
				bind:activeSection
				bind:loadingLabel
				bind:activeLoading
				bind:destinations
				{index}
			/> -->
		<!-- {/each} 
		{/if}-->
	</FormSection>
	<FormSection title="Specialities" icon={UserCertificationIcon} id="specialities">
		<ExperienceSection
			bind:activeSection
			{experienceType}
			advisor={advisorMe}
			target="advisors/me"
			on:change={handleChange}
		/>
	</FormSection>
	{#if !agencyMe}
		<FormSection title="Affiliations" icon={StarIcon} id="affiliations">
			<!-- <Affiliation
				bind:activeSection
				label="Agency"
				name="Agencies"
				affiliate={advisorMe.agency?.affiliate_agencies}
				list={$affiliateAgencyStore}
				target="advisors/me"
				on:change={handleChange}
			/>
			<Affiliation
				bind:activeSection
				label="Networks"
				name="Networks"
				affiliate={advisorMe.agency?.affiliate_networks}
				list={$affiliateNetworkStore}
				target="advisors/me"
				on:change={handleChange}
			/>
			<Affiliation
				bind:activeSection
				label="Benefit Programs"
				name="Benefit Programs"
				affiliate={advisorMe.agency?.affiliate_benefit_programs}
				list={$affiliateBenefitProgramStore}
				target="advisors/me"
				on:change={handleChange}
			/> -->
			<Affiliation
				bind:activeSection
				label="Agency"
				name="Agencies"
				affiliate={advisorMe.agency?.affiliate_agencies}
				list={affiliateAgencies}
			/>
			<Affiliation
				bind:activeSection
				label="Networks"
				name="Networks"
				affiliate={advisorMe.agency?.affiliate_networks}
				list={affiliateNetworks}
			/>
			<Affiliation
				bind:activeSection
				label="Benefit Programs"
				name="Benefit Programs"
				affiliate={advisorMe.agency?.affiliate_benefit_programs}
				list={affiliateBenefitPrograms}
			/>
		</FormSection>
	{/if}
</FormPage>
