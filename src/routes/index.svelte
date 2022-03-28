<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { get } from 'svelte/store';
	import { authStore } from '$lib/store/auth';
	import { redirect } from '$lib/helpers/redirect.svelte';

	export const load: Load = async () => {
		const { user } = get(authStore);
		if (user) {
			if (user.agencyMe) {
				return redirect('/account/agency');
			} else {
				return redirect('/account/advisor');
			}
		} else {
			return redirect('/register');
		}
		return {};
	};
</script>
