<script lang="ts" context="module">
	import 'carbon-components-svelte/css/all.css';
	import type { Load } from '@sveltejs/kit';
	import { insertToStore } from '$lib/store/types';
	import { countryStore } from '$lib/store/country';
	import { languageStore } from '$lib/store/language';
	import { salutationTypeStore } from '$lib/store/salutationType';
	import { interestTypeStore } from '$lib/store/interest';
	import { personalPreferenceTypeStore, travelPreferenceTypeStore } from '$lib/store/preference';
	import type { RootSessionData } from '$lib/store/session';
	import { destinationTypeStore } from '$lib/store/destinationType';
	import { experienceTypeStore } from '$lib/store/experienceType';
	import { paymentMethodStore } from '$lib/store/paymentMethod';
	import {
		affiliateAgencyStore,
		affiliateBenefitProgramStore,
		affiliateNetworkStore
	} from '$lib/store/affiliate';
	import { authStore } from '$lib/store/auth';
	import Toast from '$lib/components/Toast.svelte';
	import PopupWarningSaveForm from '$lib/components/form/PopupWarningSaveForm.svelte';

	export const load: Load = async ({ session }) => {
		const { user, metadata } = session as RootSessionData;

		if (metadata) {
			insertToStore(countryStore, metadata.countries, false);
			insertToStore(languageStore, metadata.languages, false);
			insertToStore(salutationTypeStore, metadata.salutationTypes, false);
			insertToStore(interestTypeStore, metadata.interestTypes, false);
			insertToStore(travelPreferenceTypeStore, metadata.travelPreferenceTypes, false);
			insertToStore(personalPreferenceTypeStore, metadata.personalPreferenceTypes, false);
			insertToStore(paymentMethodStore, metadata.paymentMethods, false);
			insertToStore(affiliateAgencyStore, metadata.affiliateAgencies, false);
			insertToStore(affiliateNetworkStore, metadata.affiliateNetworks, false);
			insertToStore(affiliateBenefitProgramStore, metadata.affiliateBenefitPrograms, false);
			insertToStore(experienceTypeStore, metadata.experienceTypes, false);
			insertToStore(destinationTypeStore, metadata.destinationTypes, false);
		}

		authStore.set({ user });
		return {
			props: {}
		};
	};
</script>

<slot />
<Toast />
<PopupWarningSaveForm />
