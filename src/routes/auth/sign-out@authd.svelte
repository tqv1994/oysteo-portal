<script lang="ts" context="module">
	import 'carbon-components-svelte/css/all.css';
	import '../../theme/oysteo.scss';
	import { Link } from 'carbon-components-svelte';
	import type { Load } from '@sveltejs/kit';
	import { redirect } from '$lib/helpers/redirect.svelte';

	export const load: Load = async ({ session: { user, agencyMe, advisorMe } }) => {
		if (!user) {
			return redirect('/auth/register');
		}
		return {};
	};
</script>

<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import '../../theme/oysteo.scss';
	import { ppost } from '$lib/utils/fetch';
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';

	async function signOut() {
		try {
			await ppost('auth/sign-out', {});
		} catch (error) {
			// Do nothing
		}
		session.update((s) => {
			s.user = undefined;
			s.agencyMe = undefined;
			s.advisorMe = undefined;
			return s;
		});
	}
</script>

<div class="content">
	<h1>Really sign out?</h1>
	<ul>
		<li>
			<Link href="#" on:click={signOut}>Yes, sign out</Link>
		</li>
		<li>
			<Link href="/profile/advisor">Stay signed in</Link>
		</li>
	</ul>
</div>

<style lang="scss">
	li {
		margin-bottom: 10px;
	}
</style>
