<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { redirect } from '$lib/helpers/redirect.svelte';

	export const load: Load = async ({ session: { user, agencyMe } }) => {
		let link = '/auth/register';
		if (user) {
			link = agencyMe ? '/profile/agency' : '/profile/advisor';
		}
		return redirect(link);
	};
</script>
