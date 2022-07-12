<script lang="ts" context="module">
	import 'carbon-components-svelte/css/all.css';
	import '../../theme/oysteo.scss';
	import type { Load } from '@sveltejs/kit';
	import { redirect } from '$lib/helpers/redirect.svelte';

	export const load: Load = async ({ session: { advisorMe } }) => {
		return redirect('/');
	};
</script>
