<script lang="ts" context="module">
	import '$lib/utils/firebase';
	import type { Load } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';

	export const load: Load = async ({ url, session: { user } }) => {
		if (user) {
			const redirect = '/';
			if (browser) {
				goto(redirect);
			} else {
				return {
					status: 302,
					redirect
				};
			}
		}

		const email = url.searchParams.get('email');

		return {
			props: {
				email
			}
		};
	};
</script>

<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import '../../theme/oysteo.scss';
	import { Button, Link } from 'carbon-components-svelte';
	import ODeviceDetector from '$lib/components/ODeviceDetector.svelte';
	import { notify } from '$lib/components/Toast.svelte';
	import { isValidEmail } from '$lib/helpers/utils';
	export let email: string;

	let sentTs: number;

	const reSendAccountVerifyLink = async () => {
		if (!email || !isValidEmail(email)) {
			notify({
				kind: 'error',
				title: 'Oops',
				subtitle:
					"The email address is invalid... you're probably in the wrong place. Redirecting you to the home page"
			});
			// goto('/');
			return;
		}
		const nowTs = new Date().getTime();
		if (sentTs && sentTs < nowTs + 60 * 1000) {
			notify({
				kind: 'warning',
				title: 'Slow down',
				subtitle:
					'Please wait a minute before trying again - even email takes time to be delivered.'
			});
			return;
		}
		try {
			const res = await fetch(`/p/auth/send-agency-email-verification-link`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			});
			if (res.ok) {
				sentTs = nowTs;
				notify({
					kind: 'success',
					title: 'Done',
					subtitle:
						"The email has been sent successfully. If you still don't receive it, please check your spam folder or check with your email provider/administator that oysteo.com is whitelisted."
				});
			} else {
				console.log(res);
			}
		} catch (error) {
			if (error.errorInfo) {
				switch (error.errorInfo) {
					case 'auth/user-not-found':
						notify({
							kind: 'error',
							title: 'Oops',
							subtitle:
								"This is strange - we couldn't find your email address... please register again"
						});
						goto('/auth/register');
						break;
					default:
						console.error(error.errorInfo);
				}
			} else {
				console.error(error);
			}
		}
	};
</script>

<ODeviceDetector showInMobile={true}>
	<h1>Sign Up Success</h1>
</ODeviceDetector>
<div class="section-login--messenge">
	<ODeviceDetector showInDesktop={true}>
		<h1>Sign Up Success</h1>
	</ODeviceDetector>
	<div class="section-login--messenge-content">
		<p>
			We have sent an email to {#if email}<b>{email}</b>{:else}you{/if} with a link to verify your account.
		</p>
		<p>Please check your email and click the link provided.</p>
		<p>If you haven’t received our email, please click <b>RESEND</b>.</p>
	</div>
	<div>
		{#if email}
			<Button kind="secondary" type="button" on:click={reSendAccountVerifyLink} class="btn-submit"
				>RESEND</Button
			>
		{/if}
	</div>
	<div class="section-resetpw">
		<p>Got the email?</p>
		<Link href="/auth/sign-in">Sign in</Link>
	</div>
</div>

<style lang="scss">
	b {
		font-weight: 700;
	}
	.section-forgot {
		--cds-disabled-03: #fff;
	}
	p {
		margin-bottom: 1em;
	}
</style>
