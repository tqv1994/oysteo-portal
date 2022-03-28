<script lang="ts" context="module">
	import { Content } from 'carbon-components-svelte';
	import {
		Password20,
		Enterprise20,
		Identification20,
		ToolBox20,
		ShareKnowledge20,
		Star20,
		Bullhorn20,
		Wallet20
	} from 'carbon-icons-svelte';
	import FormSection from '$lib/components/form/section.svelte';
	import NavigationSection from '$lib/components/navigation/modal.svelte';
	import DesktopNavigationSection from '$lib/components/navigation/desktop_nav_section.svelte';
	import { afterUpdate } from 'svelte';
	import { authStore } from '$lib/store/auth';
	import {
		affiliateAgencyStore,
		affiliateBenefitProgramStore,
		affiliateNetworkStore
	} from '$lib/store/affiliate';
	import IdAndPassword from '$lib/components/section/IdAndPassword.svelte';
	import PhoneNumber from '$lib/components/section/PhoneNumber.svelte';
	import Contact from '$lib/components/section/Contact.svelte';
	import AddressGroup from '$lib/components/section/AddressGroup.svelte';
	import Affiliation from '$lib/components/section/Affiliation.svelte';
	import BusinessInformation from '$lib/components/section/BusinessInformation.svelte';
	import BusinessInsurance from '$lib/components/section/BusinessInsurance.svelte';
	import BusinessAssociation from '$lib/components/section/BusinessAssociation.svelte';
	import AgencyLogo from '$lib/components/section/AgencyLogo.svelte';
	import MarketingInfo from '$lib/components/section/MarketingInfo.svelte';
	import AgencyPhoto from '$lib/components/section/AgencyPhoto.svelte';
	import CreateAdvisor from '$lib/components/section/agency-advisor/CreateAdvisor.svelte';
	import AdvisorList from '$lib/components/section/agency-advisor/AdvisorList.svelte';
	import BillPayment from '$lib/components/section/BillPayment.svelte';
	import { onAfterOpenForm } from '$lib/helpers/scripts';
	import { sortByName } from '$lib/utils/sort';
	import type { Load } from '@sveltejs/kit';
	import { get } from 'svelte/store';
	import type { AdvisorAgency } from '$lib/store/advisor';

	export const load: Load = async ({fetch}) => {
		const { user } = get(authStore);
		if(user.agencyMe && user.agencyMe.advisors === undefined){
			const res = await fetch('/account/agency/advisors/list-advisors.json');
			if(res.ok){
				const data: AdvisorAgency[] = await res.json();
				user.agencyMe.advisors = data;
				authStore.set({user});
			}else{
				const error = await res.json();
      			console.error(error);
			}
		}
		return {};
	};
</script>

<script lang="ts">
	let activeSection = '';
	let y: number, prevY: number;
	let navFixed = '';
	const type = 'agency';

	const setEditing = (sectionName: string) => () => {
		activeSection = sectionName;
		onAfterOpenForm();
	};

	const agencySections = [
		{ id: 'id-and-password', text: 'ID and Password' },
		{ id: 'contacts', text: 'Contacts' },
		{ id: 'address', text: 'Address' },
		{ id: 'business-infomation', text: 'Business Information' },
		{ id: 'marketing-infomation', text: 'Marketing Information' },
		{ id: 'advisors', text: 'Advisors' },
		{ id: 'billing-and-payment', text: 'Billing & Payment' },
		{ id: 'affiliations', text: 'Affiliations' }
	];

	afterUpdate(() => {
		navFixed = prevY > y ? 'nav-fixed' : '';
		prevY = y;
	});
</script>

<svelte:window bind:scrollY={y} />
<NavigationSection items={agencySections} class={navFixed} />
<div class="content">
	<div class="title-content">
		<p class="tab-mobile">Agency</p>
		<h1>Profile</h1>
		<DesktopNavigationSection items={agencySections} />
	</div>
	{#if $authStore.user}
		<FormSection title="ID and Password" icon={Password20} id="id-and-password">
			<IdAndPassword user={$authStore.user} bind:activeSection />
		</FormSection>
	{/if}

	<FormSection title="Contacts" icon={Identification20} id="contacts">
		<Contact bind:activeSection object={$authStore.user.agencyMe} {type} />
		<PhoneNumber bind:activeSection object={$authStore.user.agencyMe} {type} />
	</FormSection>

	<FormSection title="Address" icon={Enterprise20} id="address">
		<!-- address -->
		<AddressGroup
			bind:activeSection
			address={$authStore.user.agencyMe.addresses}
			{type}
			userId={$authStore.user.id}
			objectId={$authStore.user.agencyMe.id}
		/>
		<!-- address -->
	</FormSection>

	<FormSection title="Business Information" icon={ToolBox20} id="business-infomation">
		<BusinessInformation bind:activeSection agency={$authStore.user.agencyMe} {type} />
		<BusinessInsurance bind:activeSection agency={$authStore.user.agencyMe} {type} />
		<BusinessAssociation bind:activeSection agency={$authStore.user.agencyMe} {type} />
	</FormSection>

	<FormSection title="Marketing Information" icon={Bullhorn20} id="marketing-infomation">
		<MarketingInfo bind:activeSection agency={$authStore.user.agencyMe} {type}>
			<AgencyLogo bind:activeSection agency={$authStore.user.agencyMe} />
			<AgencyPhoto bind:activeSection agency={$authStore.user.agencyMe} />
		</MarketingInfo>
	</FormSection>

	<FormSection
		title="Advisors"
		icon={ShareKnowledge20}
		rightIcon
		titleRightIcon={'Add Another Advisor'}
		id="advisors"
		on:add={setEditing('advisor-add')}
	>
		<CreateAdvisor
			bind:activeSection
			agencyId={$authStore.user.agencyMe.id}
			bind:advisors={$authStore.user.agencyMe.advisors}
		/>
		<AdvisorList bind:activeSection bind:advisors={$authStore.user.agencyMe.advisors} />
	</FormSection>

	<FormSection title="Billing and payments" icon={Wallet20} id="billing-and-payment">
		<BillPayment
			bind:activeSection
			agencyId={$authStore.user.agencyMe.id}
			payments={$authStore.user.agencyMe.payments}
		/>
	</FormSection>

	<FormSection title="Affiliations" icon={Star20} id="affiliations">
		<Affiliation
			bind:activeSection
			objectId={$authStore.user.agencyMe.id}
			{type}
			label="Agency"
			name="Agencies"
			affiliate={$authStore.user.agencyMe.affiliate_agencies}
			list={sortByName(Object.values($affiliateAgencyStore.items))}
			allowEdit
		/>
		<Affiliation
			bind:activeSection
			objectId={$authStore.user.agencyMe.id}
			{type}
			label="Networks"
			name="Networks"
			affiliate={$authStore.user.agencyMe.affiliate_networks}
			list={sortByName(Object.values($affiliateNetworkStore.items))}
			allowEdit
		/>
		<Affiliation
			bind:activeSection
			objectId={$authStore.user.agencyMe.id}
			{type}
			label="Benefit Programs"
			name="Benefit Programs"
			affiliate={$authStore.user.agencyMe.affiliate_benefit_programs}
			list={sortByName(Object.values($affiliateBenefitProgramStore.items))}
			allowEdit
		/>
	</FormSection>
	<div id="fake-height" />
</div>
