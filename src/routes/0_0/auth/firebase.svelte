<script lang="ts" context="module">
	import '$lib/utils/firebase';
	import type { Load } from '@sveltejs/kit';
	import { applyActionCode, browserSessionPersistence, getAuth } from 'firebase/auth';
	import { redirect } from '$lib/helpers/redirect.svelte';
	import { type Toast, notify } from '$lib/components/Toast.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export const load: Load = async ({ url }) => {
		const mode = url.searchParams.get('mode');
		const token = url.searchParams.get('oobCode');
		if (!mode || !token) {
			return redirect('/account');
		}
		switch (mode) {
			case 'resetPassword':
				return redirect('/auth/reset-password', { token });
			case 'recoverEmail':
				return redirect('/auth/sign-in', { token });
			default: // verfiyEmail
				return { props: { token } };
		}
	};
</script>

<script lang="ts">
	export let token: string;
	onMount(async () => {
		const auth = getAuth();
		await auth.setPersistence(browserSessionPersistence);
		try {
			await applyActionCode(auth, token);
			notify({
				kind: 'success',
				title: 'Success',
				subtitle: 'Your account has been successfully verified.'
			});
		} catch (error) {
			console.log(error);
			notify({
				title: "Couldn't verify your email address",
				subtitle: 'Your account verification link has expired. Please request another link'
			});
		}
		goto('/auth/sign-in');
	});
</script>
