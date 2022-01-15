<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { authStore } from '$lib/store/auth';
	import { insertToStore } from '$lib/store/types';
	import { countryStore } from '$lib/store/country';
	import { languageStore } from '$lib/store/language';
	import type { Locals } from '$lib/store/local';
	import { salutationTypeStore } from '$lib/store/salutationType';

	export const load: Load<{ session: Locals }> = async ({ session, url }) => {
		insertToStore(countryStore, session.metadata?.countries, false);
		insertToStore(languageStore, session.metadata?.languages, false);
		insertToStore(salutationTypeStore, session.metadata?.salutationTypes, false);
		insertToStore(interestTypeStore, session.metadata?.interestTypes, false);
		insertToStore(travelPreferenceTypeStore, session.metadata?.travelPreferenceTypes, false);
		insertToStore(personalPreferenceTypeStore, session.metadata?.personalPreferenceTypes, false);
		let redirect = null;
		if (session.user) {
			authStore.set({ user: session.user });
			if (!url.pathname.startsWith('/account')) {
				redirect = '/account';
			} else {
				if (!session.user.advisorMe && url.pathname.startsWith('/account/advisor')) {
					window.openNotification({
						kind: 'warning',
						title: 'Warning',
						subtitle: 'You are not an advisor, so you do not have access to this function.'
					});
					redirect = '/account';
				} else if (!session.user.agencyMe && url.pathname.startsWith('/account/agency')) {
					window.openNotification({
						kind: 'warning',
						title: 'Warning',
						subtitle: 'You are not an agency, so you do not have access to this function.'
					});
					redirect = '/account';
				}
			}
		} else {
			if (url.pathname.startsWith('/account')) {
				redirect = '/';
			}
		}

		if (redirect) {
			return {
				status: 302,
				redirect
			};
		}
		return {
			props: {}
		};
	};
</script>

<script lang="ts">
	import Loading from '$lib/components/form/loading.svelte';
	import Notification from '$lib/components/Notification.svelte';
	import { interestTypeStore } from '$lib/store/interest';
	import { personalPreferenceTypeStore, travelPreferenceTypeStore } from '$lib/store/preference';
</script>

<slot />
<svelte:component this={Notification} />
<svelte:component this={Loading} />
