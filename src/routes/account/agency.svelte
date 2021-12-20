<script lang="ts" context="module">
	import 'carbon-components-svelte/css/all.css';
	import '$lib/utils/firebase';
	import { TextInput, Select, SelectItem, Loading } from 'carbon-components-svelte';
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
	import OverlayLoading from '$lib/components/form/loading.svelte';
	import NavigationSection from '$lib/components/navigation/modal.svelte';
	import DesktopNavigationSection from '$lib/components/navigation/desktop_nav_section.svelte';

	import type { Load } from '@sveltejs/kit';
	import { afterUpdate } from 'svelte';

	import type { User } from '$lib/store/user';
	import type { Country } from '$lib/store/country';
	import type { AffiliateAgencies, AffiliateNetwork } from '$lib/store/affiliate';
	import type { Agency } from '$lib/store/agency';
	import type { AdvisorAgency } from '$lib/store/advisor';
	import type { Address } from '$lib/store/address';
	import type { SalutationType } from '$lib/store/salutationType';

	import IdAndPassword from '$lib/components/section/IdAndPassword.svelte';
	import type { Metadata } from '$lib/store/metadata';
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
	import type { Payment, PaymentMethod } from '$lib/store/payment';
	import BillPayment from '$lib/components/section/BillPayment.svelte';

	export const load: Load = async ({ fetch, session }) => {
		try {
			let user: User | undefined = session.user;
			let metadata: Metadata | undefined = session.metadata;
			const res = await fetch(`/agency.json`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (res.ok) {
				const data = await res.json();
				let agency = data.me.agencyMe;
				return {
					props: {
						user: user,
						agency: agency,
						countries: metadata.countries,
						addresses: agency !== null ? agency.addresses : [],
						advisors: agency !== null ? agency.advisors : [],
						affiliateAgencies: agency !== null ? agency.affiliate_agencies : [],
						affiliateNetworks: agency !== null ? agency.affiliate_networks : [],
						payments: agency !== null ? agency.payments : [],
						affiliateAgencyList: metadata.affiliateAgencies,
						affiliateNetworkList: metadata.affiliateNetworks,
						salutationTypes: metadata.salutationTypes,
						paymentMethods: metadata.paymentMethods
					}
				};
			}
		} catch (error) {
			console.log('Error agency: ' + error);
		}
	};
</script>

<script lang="ts">
	export let user: User;
	export let countries: Country[] = [];
	export let agency: Agency;
	export let addresses: Address[] = [];
	export let advisors: AdvisorAgency[] = [];
	export let affiliateAgencies: AffiliateAgencies[] = [];
	export let affiliateNetworks: AffiliateNetwork[] = [];
	export let payments: Payment[] = [];

	export let affiliateAgencyList: AffiliateAgencies[] = [];
	export let affiliateNetworkList: AffiliateNetwork[] = [];
	export let salutationTypes: SalutationType[] = [];
	export let paymentMethods: PaymentMethod[] = [];

	let activeSection: string = '';
	let loadingLabel = 'Saving ...';
	let y: number, prevY: number;
	let navFixed: string = '';
	let activeLoading = false;
	const type = 'agency';

	const setEditing = (sectionName: string) => () => {
		activeSection = sectionName;
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
<OverlayLoading bind:activeLoading bind:label={loadingLabel} />
<NavigationSection items={agencySections} class={navFixed} />
<div class="content">
	<div class="title-content">
		<h1>Profile</h1>
		<DesktopNavigationSection items={agencySections} />
	</div>
	{#if user}
		<FormSection title="ID and Password" icon={Password20} id="id-and-password">
			<IdAndPassword {user} bind:activeSection bind:activeLoading />
		</FormSection>
	{/if}

	<FormSection title="Contacts" icon={Identification20} id="contacts">
		<Contact bind:activeSection bind:activeLoading object={agency} {type} />
		<PhoneNumber {countries} bind:activeSection bind:activeLoading object={agency} {type} />
	</FormSection>

	<FormSection title="Address" icon={Enterprise20} id="address">
		<!-- address -->
		<AddressGroup
			bind:activeSection
			bind:activeLoading
			address={addresses}
			{countries}
			{type}
			userId={user.id}
			objectId={agency.id}
		/>
		<!-- address -->
	</FormSection>

	<FormSection title="Business Information" icon={ToolBox20} id="business-infomation">
		<BusinessInformation bind:activeSection bind:activeLoading {agency} {type} />
		<BusinessInsurance bind:activeSection bind:activeLoading {agency} {type} />
		<BusinessAssociation bind:activeSection bind:activeLoading {agency} {type} />
	</FormSection>

	<FormSection title="Marketing Information" icon={Bullhorn20} id="marketing-infomation">
		<MarketingInfo bind:activeSection bind:activeLoading {agency} {type}>
			<AgencyLogo bind:activeSection bind:loadingLabel bind:activeLoading {agency} />
			<AgencyPhoto bind:activeSection bind:loadingLabel bind:activeLoading {agency} />
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
			bind:activeLoading
			{salutationTypes}
			agencyId={agency.id}
			bind:advisors
		/>
		<AdvisorList bind:activeSection bind:activeLoading {salutationTypes} bind:advisors />
	</FormSection>

	<FormSection title="Billing and payments" icon={Wallet20} id="billing-and-payment">
		<BillPayment
			bind:activeSection
			bind:activeLoading
			agencyId={agency.id}
			{salutationTypes}
			{countries}
			{paymentMethods}
			{payments}
		/>
	</FormSection>

	<FormSection title="Affiliations" icon={Star20} id="affiliations">
		<Affiliation
			bind:activeSection
			bind:activeLoading
			objectId={agency.id}
			{type}
			name="Agencies"
			affiliate={affiliateAgencies}
			list={affiliateAgencyList}
		/>
		<Affiliation
			bind:activeSection
			bind:activeLoading
			objectId={agency.id}
			{type}
			name="Networks"
			affiliate={affiliateNetworks}
			list={affiliateNetworkList}
		/>
	</FormSection>
	<div id="fake-height"></div>
</div>
