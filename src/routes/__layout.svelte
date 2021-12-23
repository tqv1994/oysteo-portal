<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { authStore } from '$lib/store/auth';
	import { insertToStore } from '$lib/store/types';
	import { countryStore } from '$lib/store/country';
	import { languageStore } from '$lib/store/language';
	import type { Locals } from '$lib/store/local';
	import { salutationTypeStore } from '$lib/store/salutationType';

	export const load: Load<{ session: Locals }> = async ({ session, page }) => {
		insertToStore(countryStore, session.metadata?.countries, false);
		insertToStore(languageStore, session.metadata?.languages, false);
		insertToStore(salutationTypeStore, session.metadata?.salutationTypes, false);
		let redirect = null;
		if (session.user) {
			authStore.set({ user: session.user });
			if (!page.path.startsWith('/account')) {
				if (session.user.advisorMe) {
					redirect = '/account/advisor';
				} else if (session.user.agencyMe) {
					redirect = '/account/agency';
				} else {
					redirect = '/account';
				}
			} else {
				if (!session.user.advisorMe && page.path.startsWith('/account/advisor')) {
					window.openNotification({
						kind: 'warning',
						title: 'Warning',
						subtitle: 'You are not an advisor, so you do not have access to this function.'
					});
					redirect = '/account';
				} else if (!session.user.agencyMe && page.path.startsWith('/account/agency')) {
					window.openNotification({
						kind: 'warning',
						title: 'Warning',
						subtitle: 'You are not an agency, so you do not have access to this function.'
					});
					redirect = '/account';
				}
			}
		} else {
			if (page.path.startsWith('/account')) {
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
	import Notification from '$lib/components/Notification.svelte';
</script>

<slot />
<svelte:component this={Notification} />
