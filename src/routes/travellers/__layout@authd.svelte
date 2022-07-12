<script lang="ts" context="module">
	import 'carbon-components-svelte/css/all.css';
	import '$lib/utils/firebase';
	import type { Load } from '@sveltejs/kit';
	import { redirect } from '$lib/helpers/redirect.svelte';
	import { tripStore } from '$lib/store/trip';
	import { pget } from '$lib/utils/fetch';
	import { travellersStore } from '$lib/store/traveller';

	export const load: Load = async ({ fetch, session: { user, advisorMe } }) => {
		if (!user) {
			return redirect('/');
		}
		try {
			const res = await pget(fetch, `trips?advisor=${advisorMe.id}`);
			if (res.ok) {
				const trips = await res.json();
				tripStore.set(trips);
			} else {
				console.error('Failed to fetch trips', await res.text());
			}
		} catch (err) {
			console.log('Error fetch trips:', err);
		}

		try {
			const res = await pget(fetch, `travellers`);
			
			if (res.ok) {
				const travellers = await res.json();
				travellersStore.set(travellers);
			} else {
				console.error('Failed to fetch travellers', await res.text());
			}
		} catch (err) {
			console.log('Error fetch travellers:', err);
		}
		return {};
	};
</script>

<slot />
