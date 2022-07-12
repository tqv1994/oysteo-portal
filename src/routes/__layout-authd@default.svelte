<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { redirect } from '$lib/helpers/redirect.svelte';

	export const load: Load = async ({ session: { user } }) => {
		if (!user) {
			return redirect('/auth/register');
		}
		return {};
	};
</script>

<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import { beforeNavigate } from '$app/navigation';
	import OHeader from '$lib/components/navigation/OHeader.svelte';
	import { Content } from 'carbon-components-svelte';
	import '../theme/oysteo.scss';
	import { highlight, isDirty } from '$lib/store/activeForm';

	beforeNavigate(({ cancel }) => {
		if (isDirty()) {
			highlight();
			cancel();
		}
	});
</script>

<OHeader />
<Content>
	<slot />
</Content>
