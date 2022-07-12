<script lang="ts" context="module">
	import '$lib/utils/firebase';
	import type { Load } from '@sveltejs/kit';
	import { applyActionCode, browserSessionPersistence, getAuth } from 'firebase/auth';
	import { redirect } from '$lib/helpers/redirect.svelte';
	import { type Toast, notify } from '$lib/components/Toast.svelte';
	import { onMount } from 'svelte';
	import type { User } from '$lib/store/auth';

	export const load: Load = async ({ session, url }) => {
		const { user } = session;
		if (user) {
			return { props: { user } };
		}
		const mode = url.searchParams.get('mode');
		const token = url.searchParams.get('oobCode');
		const continueUrl = url.searchParams.get('continueUrl') || null;
		if (!mode || !token) {
			return redirect('/');
		}
		switch (mode) {
			case 'resetPassword':
				if (continueUrl) {
					return redirect(continueUrl, { token });
				}
				return redirect('/auth/reset-password', { token });
			case 'recoverEmail':
				return redirect('/auth/sign-in', { token });
			default: // verfiyEmail
				return { props: { token, continueUrl } };
		}
	};
</script>

<script lang="ts">
	export let user: User;
	export let token: string;
	export let continueUrl: string | null;
	onMount(async () => {
		if (user) {
			notify({
				title: 'Already signed in',
				subtitle: 'You are already signed in. Please sign out and try again.',
				timeout: 9000
			});
			redirect('/auth/sign-out');
		} else {
			const auth = getAuth();
			await auth.setPersistence(browserSessionPersistence);
			try {
				await applyActionCode(auth, token);
				notify({
					kind: 'success',
					title: 'Success',
					subtitle: 'Your account has been successfully verified.'
				});
				if (continueUrl) {
					redirect(continueUrl);
				} else {
					redirect('/auth/sign-in');
				}
			} catch (error) {
				notify({
					title: "Couldn't verify your email address",
					subtitle: 'Your account verification link has expired. Please request another link',
					timeout: 5000
				});
				if (continueUrl) {
					redirect(continueUrl);
				} else {
					redirect('/auth/sign-in');
				}
			}
		}
	});
</script>
