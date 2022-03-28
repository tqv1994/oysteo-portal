<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import '$lib/utils/firebase';
	import { redirect } from '$lib/helpers/redirect.svelte';

	export const load: Load = async () => {
		return redirect('/auth/sign-in');
	};
</script>
