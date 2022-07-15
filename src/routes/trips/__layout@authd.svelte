<script lang="ts" context="module">
	import 'carbon-components-svelte/css/all.css';
	import '$lib/utils/firebase';
	import type { Load } from '@sveltejs/kit';
	import { redirect } from '$lib/helpers/redirect.svelte';
	import { tripLeadStore, tripStore, type Trip } from '$lib/store/trip';
	import { pget, ppost } from '$lib/utils/fetch';
	import { travellersStore } from '$lib/store/traveller';

	export const load: Load = async ({ session: { user, advisorMe } }) => {
		if (!user) {
			return redirect('/');
		}
		try {
			const res = await pget(fetch, `trips?advisor=${advisorMe.id}`);
			console.log(res);
			
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
			console.log(res);

			if (res.ok) {
				const travellers = await res.json();
				travellersStore.set(travellers);
			} else {
				console.error('Failed to fetch travellers', await res.text());
			}
		} catch (err) {
			console.log('Error fetch travellers:', err);
		}

		try {
			const res = await pget(fetch, `trips/leads`);
			
			if (res.ok) {
				const trips = await res.json();
				tripLeadStore.set(trips);
			} else {
				console.error('Failed to fetch trip leads', await res.text());
			}
		} catch (err) {
			console.log('Error fetch trip leads:', err);
		}
		return {};
	};
</script>

<slot />
