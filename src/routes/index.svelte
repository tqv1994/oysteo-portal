<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { redirect } from '$lib/helpers/redirect.svelte';
	import { disableMyOysteo } from '$lib/env';

	export const load: Load = async ({ session: { user, agencyMe } }) => {
		if (user) {
			return redirect(agencyMe ? '/profile/agency' : '/profile/advisor');
		} else {
			return redirect('/auth/register');
		}
	};

	console.log('disableMyOysteo', disableMyOysteo);
</script>
