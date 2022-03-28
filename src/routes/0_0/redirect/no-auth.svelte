<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/store/auth';
	import { get } from 'svelte/store';
	import type { Locals } from '$lib/store/local';

	export const load: Load<{ session: Locals }> = async ({ url, fetch, session }) => {
		const redirect = url.searchParams.get('url') || '/';
		if (session.user) {
			await fetch(`/auth/sign-out.json?_z=${Date.now()}`);
			authStore.set({ user: undefined });
		}
		if (browser) {
			goto(redirect);
		} else {
			return {
				status: 302,
				redirect
			};
		}
		return {};
	};
</script>
