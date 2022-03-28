<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { get } from 'svelte/store';
	import { authStore } from '$lib/store/auth';
	import '$lib/utils/firebase';
	import { redirect } from '$lib/helpers/redirect.svelte';

	export const load: Load = async () => {
		const { user } = get(authStore);
		if (user) {
			return redirect('/account');
		}
		return {};
	};
</script>

<slot />