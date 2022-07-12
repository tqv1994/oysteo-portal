<script lang="ts" context="module">
	import {
		Password as PasswordIcon,
		Enterprise as EnterpriseIcon,
		Identification as IdentificationIcon,
		ToolBox as ToolBoxIcon,
		ShareKnowledge as ShareKnowledgeIcon,
		Star as StarIcon,
		Bullhorn as BullhornIcon,
		Wallet as WalletIcon
	} from 'carbon-icons-svelte';
	import FormSection from '$lib/components/form/section.svelte';
	import type { User } from '$lib/store/auth';
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
	import type { Agency } from '$lib/store/agency';
	import { getCollection } from '$lib/store/collection';
	import type { Kind } from '$lib/store/category';
	import type { Load } from '@sveltejs/kit';
	import { session } from '$app/stores';
	import FormPage from '$lib/components/form/FormPage.svelte';
	import { notify } from '$lib/components/Toast.svelte';
	import { beforeNavigate } from '$app/navigation';
	import type { Country } from '$lib/store/country';

	export const load: Load = async ({ fetch }) => {
		let affiliateAgencies = await getCollection(fetch, 'affiliate-agency');
		let affiliateBenefitPrograms = await getCollection(fetch, 'affiliate-benefit-program');
		let affiliateNetworks = await getCollection(fetch, 'affiliate-network');
		let salutationTypes = await getCollection(fetch, 'salutation-type');
		let paymentMethods = await getCollection(fetch, 'payment-method');
		let countries = await getCollection(fetch, 'country');

		return {
			props: {
				affiliateAgencies,
				affiliateBenefitPrograms,
				affiliateNetworks,
				salutationTypes,
				paymentMethods,
				countries
			}
		};
	};
</script>

<script lang="ts">
	export let paymentMethods: Kind[];
	export let salutationTypes: Kind[];
	export let affiliateAgencies: Kind[];
	export let affiliateBenefitPrograms: Kind[];
	export let affiliateNetworks: Kind[];
	export let countries: Country[];

	let createAdvisorComponent: CreateAdvisor;
	let bizInfoForm: FormSection;
	let activeSection = '';
	let user: User;
	let agencyMe: Agency;
	session.subscribe((s) => {
		user = s.user;
		agencyMe = s.agencyMe;
	});

	const setEditing = (sectionName: string) => () => {
		activeSection = sectionName;
		onAfterOpenForm();
	};

	function handleChange(event: CustomEvent<Agency>) {
		session.update((s) => {
			s.agencyMe = event.detail;
			return s;
		});
	}

	beforeNavigate(({ cancel, to }) => {
		if (!to.pathname.startsWith('/auth') && !agencyMe.legalName) {
			notify({
				title: 'Business information',
				subtitle: "Your business' legal name is required."
			});
			bizInfoForm.scrollIntoView();
			cancel();
		}
	});
</script>

<FormPage title="Profile">
	{#if user}
		<FormSection title="ID and Password" icon={PasswordIcon}>
			<IdAndPassword {user} bind:activeSection />
		</FormSection>
	{/if}

	<FormSection title="Contacts" icon={IdentificationIcon}>
		<Contact
			bind:activeSection
			name={agencyMe.name}
			email={agencyMe.email}
			target="agencies/me"
			type="agency"
			on:change={handleChange}
		/>
		<PhoneNumber
			bind:activeSection
			phone_number={agencyMe.phone_number}
			cell_mobile={agencyMe.cell_mobile}
			whatsapp={agencyMe.whatsapp}
			emergency={agencyMe.emergency}
			phone_number_code={agencyMe.phone_number_code}
			cell_mobile_code={agencyMe.cell_mobile_code}
			whatsapp_code={agencyMe.whatsapp_code}
			emergency_code={agencyMe.emergency_code}
			{countries}
			target="agencies/me"
			on:change={handleChange}
		/>
	</FormSection>

	<FormSection title="Address" icon={EnterpriseIcon}>
		<!-- address -->
		<AddressGroup
			bind:activeSection
			address={agencyMe.address}
			{countries}
			target="agencies/me"
			on:change={handleChange}
		/>
		<!-- address -->
	</FormSection>

	<FormSection bind:this={bizInfoForm} title="Business Information" icon={ToolBoxIcon}>
		<BusinessInformation
			bind:activeSection
			agency={agencyMe}
			target="agencies/me"
			on:change={handleChange}
		/>
		<BusinessInsurance
			bind:activeSection
			agency={agencyMe}
			target="agencies/me"
			on:change={handleChange}
		/>
		<BusinessAssociation
			bind:activeSection
			agency={agencyMe}
			target="agencies/me"
			on:change={handleChange}
		/>
	</FormSection>

	<FormSection title="Marketing Information" icon={BullhornIcon}>
		<MarketingInfo
			bind:activeSection
			agency={agencyMe}
			target="agencies/me"
			on:change={handleChange}
		>
			<AgencyLogo bind:activeSection agency={agencyMe} />
			<AgencyPhoto bind:activeSection agency={agencyMe} />
		</MarketingInfo>
	</FormSection>

	<FormSection
		title="Advisors"
		icon={ShareKnowledgeIcon}
		actionLabel={'Add Another Advisor'}
		id="advisors"
		on:add={() => {
			createAdvisorComponent.activate();
		}}
	>
		<CreateAdvisor
			bind:this={createAdvisorComponent}
			agencyId={agencyMe.id}
			{salutationTypes}
			advisors={agencyMe.advisors}
		/>
		<AdvisorList bind:activeSection advisors={agencyMe.advisors} {salutationTypes} />
	</FormSection>

	<FormSection title="Billing and payments" icon={WalletIcon}>
		<BillPayment
			bind:activeSection
			agency={agencyMe}
			{paymentMethods}
			{salutationTypes}
			{countries}
			target="agencies/me"
			on:change={handleChange}
		/>
	</FormSection>

	<FormSection title="Affiliations" icon={StarIcon}>
		<Affiliation
			bind:activeSection
			label="Agency"
			name="Agencies"
			affiliate={agencyMe.affiliate_agencies}
			list={affiliateAgencies}
			target="agencies/me"
			on:change={handleChange}
		/>
		<Affiliation
			bind:activeSection
			label="Networks"
			name="Networks"
			affiliate={agencyMe.affiliate_networks}
			list={affiliateNetworks}
			target="agencies/me"
			on:change={handleChange}
		/>
		<Affiliation
			bind:activeSection
			label="Benefit Programs"
			name="Benefit Programs"
			affiliate={agencyMe.affiliate_benefit_programs}
			list={affiliateBenefitPrograms}
			target="agencies/me"
			on:change={handleChange}
		/>
	</FormSection>
</FormPage>
